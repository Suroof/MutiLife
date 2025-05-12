<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="greeting">
				<text class="greeting-text">Hi {{userName}}!</text>
				<text class="sub-greeting">WHERE TO <text class="highlight">54 KING PORTS</text> <text class="dropdown-icon">▼</text></text>
			</view>
			<view class="header-right">
				<view class="search-icon" @tap="showSearch">
					<text class="iconfont">🔍</text>
				</view>
				<view class="notification-icon" @tap="showNotifications">
					<text class="iconfont">🕭</text>
					<view class="notification-badge" v-if="hasNotification"></view>
				</view>
			</view>
		</view>

		<!-- 规划类别卡片 -->
		<view class="category-section">
			<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
				<view
					class="category-item"
					v-for="(category, index) in categories"
					:key="index"
					@tap="selectCategory(index)"
					:class="{'active-category': selectedCategoryIndex === index}"
				>
					<view class="category-icon" :style="{backgroundColor: category.color}">
						<text class="iconfont" :style="{color: category.iconColor}" v-html="category.icon"></text>
					</view>
					<text class="category-name">{{category.name}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 日期选择器 -->
		<view class="date-section">
			<view class="month-selector">
				<text class="month-arrow prev" @tap="changeMonth('prev')">🠀</text>
				<text class="current-month">{{monthYear}}</text>
				<text class="month-arrow next" @tap="changeMonth('next')">🠂</text>
			</view>

			<scroll-view class="date-scroll" scroll-x="true" show-scrollbar="false" :scroll-into-view="'date-'+selectedDateIndex" :scroll-with-animation="true">
				<view
					:id="'date-'+index"
					class="date-item"
					v-for="(day, index) in calendar"
					:key="index"
					:class="{'selected-date': isSelectedDay(day)}"
					@tap="selectDate(index)"
				>
					<text class="week-name">{{day.weekDay}}</text>
					<text class="date-number">{{day.dayNumber}}</text>
					<view class="task-dot" v-if="day.hasTasks"></view>
				</view>
			</scroll-view>
		</view>

		<!-- 今日任务 -->
		<view class="task-section">
			<view class="section-header">
				<text class="section-title">Popular this month</text>
				<text class="view-all" @tap="openTaskPopup">+ ADD NEW</text>
			</view>

			<!-- 加载中状态 -->
			<view class="loading-container" v-if="loading.tasks">
				<view class="loading-spinner"></view>
				<text class="loading-text">Loading tasks...</text>
			</view>

			<!-- 错误状态 -->
			<view class="error-container" v-else-if="error.tasks">
				<text class="error-text">{{error.tasks}}</text>
				<button class="retry-btn" @tap="fetchTasks">重试</button>
			</view>

			<!-- 空任务提示 -->
			<view class="empty-task-container" v-else-if="!hasTasks">
				<image src="/static/empty-tasks.png" mode="aspectFit" class="empty-task-image"></image>
				<text class="empty-task-text">No events for this date</text>
				<button class="add-task-btn" @tap="openTaskPopup">Add Event</button>
			</view>

			<!-- 任务列表 -->
			<view
				class="task-card"
				v-else
				v-for="(task, index) in filteredTasks"
				:key="task._id || index"
				@tap="editTask(task, index)"
			>
				<view class="task-info">
					<view class="task-main">
						<text class="task-title">{{task.title || '无标题任务'}}</text>
						<text class="task-time">{{formatTimeFromDate(task.dueDate)}}</text>
					</view>
					<text class="task-category"
                        :style="{backgroundColor: getCategoryColor(task.category || ''), color: '#FFFFFF'}">
						{{getCategoryName(task.category || '')}}
					</text>
				</view>
				<text class="task-delete" @tap.stop="deleteTask(task._id)">🗑️</text>
			</view>
		</view>

		<!-- 推荐活动 -->
		<view class="recommended-section">
			<view class="section-header">
				<text class="section-title">Best Destination</text>
				<text class="view-all" @tap="viewAllDestinations">SEE ALL</text>
			</view>

			<view class="destination-grid">
				<view class="destination-card large" @tap="viewActivity(recommendedActivities[0])" v-if="recommendedActivities && recommendedActivities.length > 0">
					<image class="destination-image"
                        :src="recommendedActivities[0] && recommendedActivities[0].image"
                        mode="aspectFill"></image>
					<view class="destination-overlay">
						<text class="destination-name">{{recommendedActivities[0] && recommendedActivities[0].name}}</text>
						<view class="destination-rating">
							<text class="rating-value">{{recommendedActivities[0] && recommendedActivities[0].rating}}</text>
							<text class="iconfont star-icon">⭐</text>
						</view>
					</view>
				</view>

				<view class="right-column" v-if="recommendedActivities && recommendedActivities.length > 1">
					<view class="destination-card medium" @tap="viewActivity(recommendedActivities[1])">
						<image class="destination-image"
                            :src="recommendedActivities[1] && recommendedActivities[1].image"
                            mode="aspectFill"></image>
						<view class="destination-overlay">
							<text class="destination-name">{{recommendedActivities[1] && recommendedActivities[1].name}}</text>
							<view class="destination-rating">
								<text class="rating-value">5.0</text>
								<text class="iconfont star-icon">⭐</text>
							</view>
						</view>
					</view>

					<view class="destination-card small" @tap="viewActivity(recommendedActivities[2])" v-if="recommendedActivities.length > 2">
						<image class="destination-image"
                            :src="recommendedActivities[2] && recommendedActivities[2].image"
                            mode="aspectFill"></image>
						<view class="destination-overlay">
							<text class="destination-name">{{ recommendedActivities[2] && recommendedActivities[2].name }}</text>
							<view class="destination-rating">
								<text class="rating-value">{{ recommendedActivities[2] && recommendedActivities[2].rating }}</text> -->
								 <text class="iconfont star-icon">⭐</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加任务弹窗 -->
		<view class="task-popup" v-if="showTaskPopup">
			<view class="popup-mask" @tap="closeTaskPopup"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{isEditing ? '编辑任务' : '添加任务'}}</text>
					<text class="iconfont close-icon" @tap="closeTaskPopup">✕</text>
				</view>

				<view class="popup-form">
					<view class="form-item">
						<text class="form-label">任务标题</text>
						<input type="text" class="form-input" v-model="newTask.title" placeholder="输入任务标题" />
					</view>

					<view class="form-item">
						<text class="form-label">描述</text>
						<input type="text" class="form-input" v-model="newTask.description" placeholder="任务描述（可选）" />
					</view>

					<view class="form-item">
						<text class="form-label">时间</text>
						<picker mode="time" :value="newTask.time" @change="onTimeChange" class="time-picker">
							<view class="picker-value">
								<text>{{newTask.time || '12:00'}}</text>
								<text class="iconfont dropdown-icon">▼</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<text class="form-label">分类</text>
						<picker :range="categoryOptions" :value="selectedCategoryIndex" @change="onCategoryChange" class="category-picker">
							<view class="picker-value">
								<text>{{categoryOptions[selectedCategoryIndex] || '所有'}}</text>
								<text class="iconfont dropdown-icon">▼</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<text class="form-label">优先级</text>
						<picker :range="['低', '中', '高']" :value="priorityIndex" @change="onPriorityChange" class="priority-picker">
							<view class="picker-value">
								<text>{{['低', '中', '高'][priorityIndex] || '中'}}</text>
								<text class="iconfont dropdown-icon">▼</text>
							</view>
						</picker>
					</view>

					<button class="submit-btn" @tap="addTask">{{isEditing ? '保存修改' : '添加任务'}}</button>
				</view>
			</view>
		</view>
	</view>

	<!-- 自定义底部导航栏 -->
	<CustomTabBar />
</template>

<script>
	import CustomTabBar from '@/components/CustomTabBar.vue'
	import plannerAPI from '@/services/api/planner.js' // 引入planner API服务
	import { isAuthenticated } from '@/services/api/request.js'

	export default {
		components: {
			CustomTabBar
		},
		data() {
			return {
				userName: '用户',
				hasNotification: true,
				categories: [
					{ id: 1, name: 'All', icon: '🌏', color: '#FF6699' },
					{ id: 2, name: 'Meeting', icon: '👜', color: '#5096FF' },
					{ id: 3, name: 'Study', icon: '🧾', color: '#6AC44E' },
					{ id: 4, name: 'Shopping', icon: '🥘', color: '#FF9B82' },
					{ id: 5, name: 'Party', icon: '💖', color: '#9E55FF' },
					{ id: 6, name: 'Sports', icon: '🏀', color: '#FFB74D' },
					{ id: 7, name: 'Sleep', icon: '💤', color: '#4ECDC4' }
				],
				selectedCategoryIndex: 0,
				currentMonth: '',
				monthYear: '',
				calendar: [],
				selectedDateIndex: 0,
				selectedDate: '',
				showTaskPopup: false,
				newTask: {
					title: '',
					description: '',
					time: '12:00',
					priority: 'medium',
					status: 'pending'
				},
				isEditing: false,
				editingTaskId: null,
				tasks: [],
				loading: {
					tasks: false,
					categories: false,
					stats: false
				},
				priorityIndex: 1,
				recommendedActivities: [
					{
						id: 1,
						name: 'Grand Canyon',
						image: '/static/images/canyon.webp',
						rating: 4.9
					},
					{
						id: 2,
						name: 'Yellow Stone',
						image: '/static/images/yellowstone.webp',
						rating: 4.8
					},
					{
						id: 3,
						name: 'Tokyo',
						image: '/static/images/Tokyo.webp',
						rating: 4.7
					}
				],
				timeOptions: [
					'08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
					'12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
					'16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
					'20:00', '20:30', '21:00'
				],
				selectedTimeIndex: 8,
				error: {
					tasks: null,
					stats: null
				},
				calendarBaseDate: new Date(),
			}
		},
		computed: {
			filteredTasks() {
				if (!this.selectedDate) return [];

				return this.tasks.filter(task => {
					const taskDate = task.dueDate ? task.dueDate.split('T')[0] : null;

					if (taskDate !== this.selectedDate) {
						return false;
					}

					if (this.selectedCategoryIndex !== 0) {
						return task.category === this.categories[this.selectedCategoryIndex].name.toLowerCase();
					}

					return true;
				});
			},
			hasTasks() {
				return this.filteredTasks && this.filteredTasks.length > 0;
			},
			formattedDate() {
				if (!this.selectedDate) return '';

				const date = new Date(this.selectedDate);
				const options = { weekday: 'long', month: 'long', day: 'numeric' };
				return date.toLocaleDateString('en-US', options);
			},
			categoryOptions() {
				return this.categories.map(category => category.name);
			}
		},
		created() {
			this.generateCalendarData();

			try {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					const parsedInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
					this.userName = parsedInfo.username || '用户';
				}
			} catch (e) {
				console.error('获取用户信息失败:', e);
			}

			if (!isAuthenticated()) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				return;
			}

			this.fetchTasks();

			this.fetchTaskStats();
		},
		methods: {
			isSelectedDay(day) {
				return this.selectedDateIndex === this.calendar.indexOf(day);
			},

			formatTimeFromDate(dateString) {
				if (!dateString) return '';

				try {
					const date = new Date(dateString);
					if (isNaN(date.getTime())) return '';

					const hours = date.getHours();
					const minutes = date.getMinutes().toString().padStart(2, '0');
					const ampm = hours >= 12 ? '下午' : '上午';
					const hours12 = hours % 12 || 12;

					return `${ampm} ${hours12}:${minutes}`;
				} catch (error) {
					console.error('时间格式化错误', error);
					return '';
				}
			},

			onPriorityChange(e) {
				const index = parseInt(e.detail.value);
				this.priorityIndex = index || 0;
				const priorities = ['low', 'medium', 'high'];
				this.newTask.priority = priorities[this.priorityIndex];
			},

			async fetchTasks() {
				try {
					this.loading.tasks = true;
					this.error.tasks = null;

					const response = await plannerAPI.getTasks();
					if (response) {
						if (Array.isArray(response)) {
							this.tasks = response;
						}
						else if (response.data) {
							this.tasks = Array.isArray(response.data) ? response.data : [];
						}
						else {
							this.tasks = [];
						}

						this.updateCalendarTaskIndicators();
					} else {
						this.error.tasks = '获取任务失败：无响应数据';
						this.tasks = [];
					}
				} catch (error) {
					console.error('获取任务错误:', error);
					this.error.tasks = `获取任务出错: ${error.message || '未知错误'}`;
					this.tasks = [];

					uni.showToast({
						title: '获取任务出错',
						icon: 'none'
					});
				} finally {
					this.loading.tasks = false;
				}
			},

			async fetchTaskStats() {
				try {
					this.loading.stats = true;
					this.error.stats = null;

					const response = await plannerAPI.getTaskStats();
					if (response && (response.data || response.status)) {
						console.log('任务统计数据:', response.data || response);
					} else {
						this.error.stats = '获取统计数据失败：无响应数据';
					}
				} catch (error) {
					console.error('获取任务统计错误:', error);
					this.error.stats = `获取统计数据出错: ${error.message || '未知错误'}`;
				} finally {
					this.loading.stats = false;
				}
			},

			updateCalendarTaskIndicators() {
				if (!this.calendar || !this.tasks) return;

				this.calendar.forEach(day => {
					if (!day) return;

					day.hasTasks = this.tasks.some(task => {
						if (!task || !task.dueDate) return false;
						const taskDate = task.dueDate.split('T')[0];
						return taskDate === day.date;
					});
				});
			},

			generateCalendarData() {
				const baseDate = new Date(this.calendarBaseDate); // 使用基准日期
				const currentDisplayMonth = baseDate.getMonth();
				const currentDisplayYear = baseDate.getFullYear();

				// 更新月份和年份的显示
				const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
					'七月', '八月', '九月', '十月', '十一月', '十二月'];
				this.currentMonth = monthNames[currentDisplayMonth]; // 更新 data 中的 currentMonth
				this.monthYear = `${this.currentMonth} ${currentDisplayYear}`;

				// 生成14天日历，例如从基准日期的前3天开始，以使基准日期大致在中间
				// 您可以根据需要调整这个偏移量
				const startDate = new Date(baseDate);
				startDate.setDate(startDate.getDate() - 3); // 调整日历的起始点

				this.calendar = [];
				let foundSelectedDateInNewRange = false;
				let newSelectedDateIndex = -1;

				for (let i = 0; i < 14; i++) {
					const date = new Date(startDate);
					date.setDate(startDate.getDate() + i);

					const dateFormatted = this.formatDate(date);
					const weekDay = this.getWeekdayShort(date.getDay());
					const dayNumber = date.getDate();
					// isToday 的判断应该基于真实今天的日期，而不是循环中的日期是否等于基准日期
					const isTodayReal = this.isDateToday(date);
					const hasTasks = this.tasks.some(task => {
						if (!task || !task.dueDate) return false;
						const taskDate = task.dueDate.split('T')[0];
						return taskDate === dateFormatted;
					});

					this.calendar.push({
						date: dateFormatted,
						weekDay,
						dayNumber,
						isToday: isTodayReal, // 使用真实的isToday
						hasTasks
					});

					// 保持或更新选中的日期
					// 如果旧的 selectedDate 在新生成的14天范围内，则保持选中
					if (dateFormatted === this.selectedDate) {
						newSelectedDateIndex = i;
						foundSelectedDateInNewRange = true;
					}
				}

				if (foundSelectedDateInNewRange) {
					this.selectedDateIndex = newSelectedDateIndex;
				} else {
					// 如果旧的 selectedDate 不在新范围内，默认选中新范围的中间某个日期
					// 或者选中新范围中与 calendarBaseDate 最接近的日期
					const baseDateFormatted = this.formatDate(baseDate);
					const baseDateIndexInCalendar = this.calendar.findIndex(d => d.date === baseDateFormatted);
					if (baseDateIndexInCalendar !== -1) {
						this.selectedDateIndex = baseDateIndexInCalendar;
						this.selectedDate = this.calendar[baseDateIndexInCalendar].date;
					} else {
						// Fallback: select the first day of the new calendar range
						this.selectedDateIndex = 0;
						this.selectedDate = this.calendar[0].date;
					}
				}
				this.updateCalendarTaskIndicators(); // 确保任务指示器也更新
			},
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			getWeekdayShort(dayIndex) {
				const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				return weekdays[dayIndex];
			},
			isDateToday(date) {
				const today = new Date();
				return date.getDate() === today.getDate() &&
					date.getMonth() === today.getMonth() &&
					date.getFullYear() === today.getFullYear();
			},
			selectCategory(index) {
				if (index === 0) {
					this.selectedCategoryIndex = index;
					return;
				}

				const category = this.categories[index];

				uni.navigateTo({
					url: `/pages/planner/category-details?id=${category.id}&name=${encodeURIComponent(category.name)}&color=${encodeURIComponent(category.color)}&icon=${encodeURIComponent(category.icon)}`,
					fail: (err) => {
						console.error('导航到分类详情页失败:', err);
						this.selectedCategoryIndex = index;
					}
				});
			},
			selectDate(index) {
				this.selectedDateIndex = index;
				this.selectedDate = this.calendar[index].date;
			},
			getCategoryColor(categoryName) {
				if (!categoryName) return '#999999';

				const category = this.categories.find(cat =>
					cat.name.toLowerCase() === categoryName.toLowerCase());
				return category ? category.color : '#999999';
			},
			getCategoryIcon(categoryName) {
				if (!categoryName) return '';

				const category = this.categories.find(cat =>
					cat.name.toLowerCase() === categoryName.toLowerCase());
				return category ? category.icon : '';
			},
			getCategoryName(categoryName) {
				if (!categoryName) return '';
				return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
			},
			openTaskPopup() {
				this.resetNewTask();
				this.showTaskPopup = true;
			},
			closeTaskPopup() {
				this.showTaskPopup = false;
			},
			resetNewTask() {
				this.newTask = {
					title: '',
					time: this.timeOptions[this.selectedTimeIndex],
					description: '',
					priority: 'medium',
					status: 'pending'
				};
				this.isEditing = false;
				this.editingTaskId = null;
				this.priorityIndex = 1;
			},
			async addTask() {
				if (!this.newTask.title.trim()) {
					uni.showToast({
						title: '请输入任务标题',
						icon: 'none'
					});
					return;
				}

				try {
					const taskData = {
						title: this.newTask.title,
						description: this.newTask.description || '',
						dueDate: `${this.selectedDate}T${this.newTask.time}:00.000Z`,
						category: this.categories[this.selectedCategoryIndex].name.toLowerCase(),
						priority: this.newTask.priority || 'medium',
						status: this.newTask.status || 'pending'
					};

					uni.showLoading({
						title: this.isEditing ? '正在更新...' : '正在添加...'
					});

					let response;
					if (this.isEditing && this.editingTaskId) {
						response = await plannerAPI.updateTask(this.editingTaskId, taskData);
					} else {
						response = await plannerAPI.createTask(taskData);
					}

					uni.hideLoading();

					const success = response && (!response.hasOwnProperty('success') || response.success);

					if (success) {
						await this.fetchTasks();
						this.closeTaskPopup();

						uni.showToast({
							title: this.isEditing ? '任务已更新' : '任务已添加',
							icon: 'success'
						});
					} else {
						const errorMsg = response?.message || (this.isEditing ? '更新任务失败' : '添加任务失败');
						uni.showToast({
							title: errorMsg,
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('任务操作错误:', error);
					uni.showToast({
						title: this.isEditing ? '更新任务出错' : '添加任务出错',
						icon: 'none'
					});
				}
			},
			formatTimeDisplay(time) {
				if (!time) return '';

				try {
					const [hours, minutes] = time.split(':');
					const hour = parseInt(hours);
					const ampm = hour >= 12 ? '下午' : '上午';
					const hour12 = hour % 12 || 12;
					return `${ampm} ${hour12}:${minutes}`;
				} catch (e) {
					console.error('时间格式化错误', e);
					return time;
				}
			},
			async deleteTask(taskId) {
				if (!taskId) {
					uni.showToast({
						title: '任务ID无效',
						icon: 'none'
					});
					return;
				}

				try {
					uni.showLoading({ title: '正在删除...' });
					const response = await plannerAPI.deleteTask(taskId);
					uni.hideLoading();

					const success = response && (!response.hasOwnProperty('success') || response.success);

					if (success) {
						const index = this.tasks.findIndex(task => task._id === taskId);
						if (index !== -1) {
							this.tasks.splice(index, 1);
						}

						this.updateCalendarTaskIndicators();

						uni.showToast({
							title: '任务已删除',
							icon: 'success'
						});
					} else {
						const errorMsg = response?.message || '删除任务失败';
						uni.showToast({
							title: errorMsg,
							icon: 'none'
						});
					}
				} catch (error) {
					uni.hideLoading();
					console.error('删除任务错误:', error);
					uni.showToast({
						title: error?.message || '删除任务出错',
						icon: 'none'
					});
				}
			},
			changeMonth(direction) {
				const newBaseDate = new Date(this.calendarBaseDate);
				let currentMonth = newBaseDate.getMonth();

				if (direction === 'prev') {
					newBaseDate.setMonth(currentMonth - 1);
					// 处理年份边界：如果月份变为负数，年份减一，月份设为11 (十二月)
					if (newBaseDate.getMonth() === (currentMonth - 1 + 12) % 12) {
						// 月份正常递减
					} else {
						// 月份跨年了
						newBaseDate.setFullYear(newBaseDate.getFullYear()); // setMonth 可能已处理年份，这里确保
					}
				} else if (direction === 'next') {
					newBaseDate.setMonth(currentMonth + 1);
					// 处理年份边界：如果月份超过11，年份加一，月份相应调整
					if (newBaseDate.getMonth() === (currentMonth + 1) % 12) {
						// 月份正常递增
					} else {
						// 月份跨年了
						newBaseDate.setFullYear(newBaseDate.getFullYear()); // setMonth 可能已处理年份
					}
				}

				this.calendarBaseDate = newBaseDate; // 更新基准日期
				this.generateCalendarData();       // 重新生成日历
				// 提示可以保留，或者根据需要移除
				// uni.showToast({
				//  title: direction === 'prev' ? '上个月' : '下个月',
				//  icon: 'none'
				// });
			},
			onTimeChange(e) {
				this.selectedTimeIndex = parseInt(e.detail.value) || 0;
				this.newTask.time = this.timeOptions[this.selectedTimeIndex];
			},
			onCategoryChange(e) {
				this.selectedCategoryIndex = parseInt(e.detail.value) || 0;
			},
			viewAllTasks() {
				uni.showToast({
					title: '查看所有任务',
					icon: 'none'
				});
			},
			viewAllDestinations() {
				uni.showToast({
					title: '查看所有目的地',
					icon: 'none'
				});
			},
			viewActivity(activity) {
				if (!activity) return;

				uni.showToast({
					title: `已选择${activity.name || '未知活动'}`,
					icon: 'none'
				});
			},
			showSearch() {
				uni.showToast({
					title: '搜索功能开发中',
					icon: 'none'
				});
			},
			showNotifications() {
				uni.showToast({
					title: '通知功能开发中',
					icon: 'none'
				});
				this.hasNotification = false;
			},
			viewMonthCalendar() {
				uni.showToast({
					title: '月视图功能开发中',
					icon: 'none'
				});
			},
			async editTask(task, index) {
				if (!task) return;

				this.isEditing = true;
				this.editingTaskId = task._id;

				let timeStr = '12:00';
				if (task.dueDate) {
					try {
						const dateObj = new Date(task.dueDate);
						if (!isNaN(dateObj.getTime())) {
							const hours = dateObj.getHours().toString().padStart(2, '0');
							const minutes = dateObj.getMinutes().toString().padStart(2, '0');
							timeStr = `${hours}:${minutes}`;
						}
					} catch (e) {
						console.error('解析任务日期时间出错', e);
					}
				}

				this.selectedTimeIndex = this.timeOptions.indexOf(timeStr);
				if (this.selectedTimeIndex === -1) this.selectedTimeIndex = 8;

				const categoryIndex = this.categories.findIndex(c =>
					c.name.toLowerCase() === (task.category || '').toLowerCase()
				);
				this.selectedCategoryIndex = categoryIndex !== -1 ? categoryIndex : 0;

				const priorityMap = { 'low': 0, 'medium': 1, 'high': 2 };
				this.priorityIndex = priorityMap[task.priority] || 1;

				this.newTask = {
					title: task.title || '',
					time: timeStr,
					description: task.description || '',
					priority: task.priority || 'medium',
					status: task.status || 'pending'
				};

				this.showTaskPopup = true;
			}
		}
	}
</script>

<style>
@font-face {
	font-family: "iconfont";
	src: url('data:font/woff2;charset=utf-8;base64,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');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.container {
	padding: 0;
	background-color: #F8F8F8;
	padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

/* 顶部导航栏 */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 0;
	padding: 30rpx;
	margin-bottom: 15rpx;
	box-shadow: none;
	border-bottom: 1px solid #F2F2F2;
}

.greeting {
	display: flex;
	flex-direction: column;
}

.greeting-text {
	font-size: 44rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
}

.sub-greeting {
	font-size: 26rpx;
	color: #666666;
}

.highlight {
	color: #FF6699;
	font-weight: bold;
}

.dropdown-icon {
	font-size: 20rpx;
	color: #999999;
	margin-left: 5rpx;
}

.header-right {
	display: flex;
	align-items: center;
}

.search-icon, .notification-icon {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #F8F8F8;
	border-radius: 16rpx;
	margin-left: 20rpx;
	position: relative;
}

.notification-badge {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #FF6699;
	position: absolute;
	top: 16rpx;
	right: 16rpx;
}

/* 规划类别区域 */
.category-section {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 30rpx;
	margin: 15rpx;
	margin-bottom: 15rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.category-scroll {
	white-space: nowrap;
}

.category-item {
	display: inline-block;
	margin-right: 45rpx;
	text-align: center;
}

.category-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12rpx;
	margin-left: auto;
	margin-right: auto;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.03);
}

.category-icon .iconfont {
	font-size: 48rpx;
}

.category-name {
	font-size: 24rpx;
	color: #333333;
	white-space: nowrap;
}

.active-category .category-name {
	color: #FF6699;
	font-weight: 500;
}

/* 日期选择区域 */
.date-section {
	background-color: #FFFFFF;
	border-radius: 0;
	padding: 20rpx 30rpx;
	margin: 15rpx;
	margin-bottom: 15rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.month-selector {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.month-arrow {
	font-family: 'iconfont';
	font-size: 36rpx;
	color: #333333;
	padding: 10rpx;
}

.current-month {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.view-all, .add-btn {
	font-size: 28rpx;
	color: #666666;
	font-weight: 500;
}

.date-scroll {
	white-space: nowrap;
	margin: 0 -5rpx;
}

.date-item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 65rpx;
	height: 100rpx;
	margin: 0 10rpx;
	border-radius: 15rpx;
	position: relative;
	background-color: white;
	border: 1px solid #F0F0F0;
}

.week-name {
	font-size: 22rpx;
	color: #999999;
	margin-bottom: 10rpx;
}

.date-number {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.selected-date {
	background-color: #FF6699;
	border: 1px solid #FF6699;
}

.selected-date .week-name,
.selected-date .date-number {
	color: #FFFFFF;
}

.task-dot {
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background-color: #FF6699;
	position: absolute;
	bottom: 12rpx;
}

.selected-date .task-dot {
	background-color: #FFFFFF;
}

/* 任务区域 */
.task-section {
	background-color: #FFFFFF;
	border-radius: 0;
	margin: 15rpx;
	padding: 30rpx;
	margin-bottom: 15rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid rgba(0, 0, 0, 0.1);
	border-top: 4rpx solid #FF6699;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loading-text {
	color: #999999;
	font-size: 28rpx;
}

.empty-task-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}

.empty-task-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-task-text {
	color: #999999;
	font-size: 28rpx;
	margin-bottom: 30rpx;
}

.add-task-btn {
	background-color: #5096FF;
	color: #FFFFFF;
	border-radius: 40rpx;
	font-size: 28rpx;
	padding: 12rpx 40rpx;
	border: none;
	line-height: 1.5;
}

.task-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	border: 1px solid #F0F0F0;
}

.task-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.task-main {
	flex: 1;
}

.task-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
	display: block;
}

.task-time {
	font-size: 24rpx;
	color: #999999;
	display: block;
}

.task-category {
	font-size: 24rpx;
	padding: 6rpx 18rpx;
	border-radius: 20rpx;
	text-align: center;
}

.task-delete {
	font-family: 'iconfont';
	color: #FF6666;
	font-size: 36rpx;
	padding: 10rpx;
}

/* 推荐活动区域 */
.recommended-section {
	background-color: transparent;
	border-radius: 0;
	padding: 0 15rpx 15rpx;
	margin-bottom: -100rpx;
}

.destination-grid {
	display: flex;
	gap: 15rpx;
	margin-top: 20rpx;
}

.right-column {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	flex: 1;
}

.destination-card {
	position: relative;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.large {
	width: 280rpx;
	height: 340rpx;
}

.medium {
	height: 170rpx;
}

.small {
	height: 155rpx;
}

.destination-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.destination-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 15rpx;
	background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.destination-name {
	font-size: 26rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.destination-rating {
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
}

.rating-value {
	font-size: 22rpx;
	color: #FFFFFF;
	margin-right: 4rpx;
}

.star-icon {
	font-size: 22rpx;
	color: #FFFFFF;
}

/* 添加任务弹窗 */
.task-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	border-radius: 30rpx 30rpx 0 0;
	padding: 40rpx 30rpx;
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	max-height: 80vh;
	overflow-y: auto;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.popup-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.close-icon {
	font-size: 40rpx;
	color: #999999;
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 16rpx;
	display: block;
}

.form-input {
	width: 100%;
	height: 90rpx;
	border: 1px solid #EEEEEE;
	border-radius: 16rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	background-color: #F8F8F8;
}

.time-picker, .category-picker {
	width: 100%;
}

.picker-value {
	width: 100%;
	height: 90rpx;
	border: 1px solid #EEEEEE;
	border-radius: 16rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #F8F8F8;
}

.dropdown-icon {
	font-size: 24rpx;
	color: #999999;
}

.submit-btn {
	background: linear-gradient(135deg, #FF6699 0%, #FF9B82 100%);
	color: #FFFFFF;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 45rpx;
	font-size: 32rpx;
	font-weight: 500;
	margin-top: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 102, 153, 0.3);
}
</style>