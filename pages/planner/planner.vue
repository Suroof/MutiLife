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

			<!-- 空任务提示 -->
			<view class="empty-task-container" v-if="!hasTasks">
				<image src="/static/empty-tasks.png" mode="aspectFit" class="empty-task-image"></image>
				<text class="empty-task-text">No popular events yet</text>
				<button class="add-task-btn" @tap="openTaskPopup">Add Event</button>
			</view>

			<!-- 任务列表 -->
			<view class="task-card" v-for="(task, index) in filteredTasks" :key="task.id" @tap="editTask(task, index)">
				<view class="task-info">
					<view class="task-main">
						<text class="task-title">{{task.title}}</text>
						<text class="task-time">{{task.time}}</text>
					</view>
					<text class="task-category" :style="{backgroundColor: getCategoryColor(task.categoryId), color: getCategoryIcon(task.categoryId)}">{{getCategoryName(task.categoryId)}}</text>
				</view>
				<text class="task-delete" @tap.stop="deleteTask(task.id)">🔍</text>
			</view>
		</view>

		<!-- 推荐活动 -->
		<view class="recommended-section">
			<view class="section-header">
				<text class="section-title">Best Destination</text>
				<text class="view-all" @tap="viewAllDestinations">SEE ALL</text>
			</view>

			<view class="destination-grid">
				<view class="destination-card large" @tap="viewActivity(recommendedActivities[0])">
					<image class="destination-image" :src="recommendedActivities[0].image" mode="aspectFill"></image>
					<view class="destination-overlay">
						<text class="destination-name">{{recommendedActivities[0].name}}</text>
						<view class="destination-rating">
							<text class="rating-value">{{recommendedActivities[0].rating}}</text>
							<text class="iconfont star-icon">🔍</text>
						</view>
					</view>
				</view>

				<view class="right-column">
					<view class="destination-card medium" @tap="viewActivity(recommendedActivities[1])">
						<image class="destination-image" :src="recommendedActivities[1].image" mode="aspectFill"></image>
						<view class="destination-overlay">
							<text class="destination-name">{{recommendedActivities[1].name}}</text>
							<view class="destination-rating">
								<text class="rating-value">5.0</text>
								<text class="iconfont star-icon">🔍</text>
							</view>
						</view>
					</view>

					<view class="destination-card small" @tap="viewActivity(recommendedActivities[2])">
						<image class="destination-image" :src="recommendedActivities[2].image" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加任务弹窗 -->
		<view class="task-popup" v-if="showTaskPopup">
			<view class="popup-mask" @tap="closeTaskPopup"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{isEditing ? 'Edit Task' : 'Add Task'}}</text>
					<text class="iconfont close-icon" @tap="closeTaskPopup">🗙</text>
				</view>

				<view class="popup-form">
					<view class="form-item">
						<text class="form-label">Task Title</text>
						<input type="text" class="form-input" v-model="newTask.title" placeholder="Enter task title" />
					</view>

					<view class="form-item">
						<text class="form-label">Time</text>
						<picker mode="time" :value="newTask.time" @change="onTimeChange" class="time-picker">
							<view class="picker-value">
								<text>{{formatTimeDisplay(newTask.time)}}</text>
								<text class="iconfont dropdown-icon">🞃</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<text class="form-label">Category</text>
						<picker :range="categoryOptions" :value="selectedCategoryIndex" @change="onCategoryChange" class="category-picker">
							<view class="picker-value">
								<text>{{categoryOptions[selectedCategoryIndex]}}</text>
								<text class="iconfont dropdown-icon">🞃</text>
							</view>
						</picker>
					</view>

					<button class="submit-btn" @tap="addTask">{{isEditing ? 'Save Changes' : 'Add Task'}}</button>
				</view>
			</view>
		</view>
	</view>

	<!-- 自定义底部导航栏 -->
	<CustomTabBar />
</template>

<script>
	import CustomTabBar from '@/components/CustomTabBar.vue'

	export default {
		components: {
			CustomTabBar
		},
		data() {
			return {
				userName: 'John',
				hasNotification: true,
				categories: [
					{ id: 1, name: 'All', icon: '\🌏', color: '#FF6699' },
					{ id: 2, name: 'Meeting', icon: '\👜', color: '#5096FF' },
					{ id: 3, name: 'Study', icon: '\🧾', color: '#6AC44E' },
					{ id: 4, name: 'Shopping', icon: '🥘', color: '#FF9B82' },
					{ id: 5, name: 'Party', icon: '\💖', color: '#9E55FF' },
					{ id: 6, name: 'Sports', icon: '\🏀', color: '#FFB74D' },
					{ id: 7, name: 'Sleep', icon: '\💤', color: '#4ECDC4' }
				],
				selectedCategoryIndex: 0,
				currentMonth: '',
				monthYear: '',
				calendar: [],
				selectedDateIndex: 0, // Index in the calendar array
				selectedDate: '',
				showTaskPopup: false,
				newTask: {
					title: '',
					time: '12:00',
					categoryId: 1
				},
				isEditing: false,
				editingIndex: -1,
				tasks: [
					{
						id: 1,
						title: 'Team Meeting',
						time: '10:00 AM',
						date: '2023-05-15',
						categoryId: 2
					},
					{
						id: 2,
						title: 'History Class',
						time: '2:30 PM',
						date: '2023-05-15',
						categoryId: 3
					},
					{
						id: 3,
						title: 'Grocery Shopping',
						time: '6:00 PM',
						date: '2023-05-17',
						categoryId: 4
					}
				],
				recommendedActivities: [
					{
						id: 1,
						name: 'Grand Canyon',
						image: '/static/canyon.jpg',
						rating: 4.9
					},
					{
						id: 2,
						name: 'Yellowstone',
						image: '/static/yellowstone.jpg',
						rating: 4.8
					},
					{
						id: 3,
						name: 'Sedona',
						image: '/static/sedona.jpg',
						rating: 4.7
					}
				],
				timeOptions: [
					'08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
					'12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
					'16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
					'20:00', '20:30', '21:00'
				],
				selectedTimeIndex: 8, // Default to 12:00
			}
		},
		computed: {
			filteredTasks() {
				if (!this.selectedDate) return [];

				return this.tasks.filter(task => {
					// Filter by date
					if (task.date !== this.selectedDate) {
						return false;
					}

					// Filter by category if not "All"
					if (this.selectedCategoryIndex !== 0) {
						return task.categoryId === this.categories[this.selectedCategoryIndex].id;
					}

					return true;
				});
			},
			hasTasks() {
				return this.filteredTasks.length > 0;
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
		},
		methods: {
			generateCalendarData() {
				const today = new Date();
				const currentMonth = today.getMonth();
				const currentYear = today.getFullYear();

				// Set current month display
				const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'];
				this.currentMonth = monthNames[currentMonth];
				this.monthYear = `${this.currentMonth} ${currentYear}`;

				// Generate 14 days starting from yesterday
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);

				this.calendar = [];
				for (let i = 0; i < 14; i++) {
					const date = new Date(yesterday);
					date.setDate(yesterday.getDate() + i);

					const dateFormatted = this.formatDate(date);
					const weekDay = this.getWeekdayShort(date.getDay());
					const dayNumber = date.getDate();
					const isToday = this.isDateToday(date);
					const hasTasks = this.checkDateHasTasks(dateFormatted);

					this.calendar.push({
						date: dateFormatted,
						weekDay,
						dayNumber,
						isToday,
						hasTasks
					});

					// Default select today
					if (isToday) {
						this.selectedDateIndex = i;
						this.selectedDate = dateFormatted;
					}
				}
			},
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			getWeekdayShort(dayIndex) {
				const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				return weekdays[dayIndex];
			},
			isDateToday(date) {
				const today = new Date();
				return date.getDate() === today.getDate() &&
					date.getMonth() === today.getMonth() &&
					date.getFullYear() === today.getFullYear();
			},
			checkDateHasTasks(dateStr) {
				return this.tasks.some(task => task.date === dateStr);
			},
			selectCategory(index) {
				this.selectedCategoryIndex = index;
			},
			selectDate(index) {
				this.selectedDateIndex = index;
				this.selectedDate = this.calendar[index].date;
			},
			getCategoryColor(categoryId) {
				const category = this.categories.find(cat => cat.id === categoryId);
				return category ? category.color : '#999999';
			},
			getCategoryIcon(categoryId) {
				const category = this.categories.find(cat => cat.id === categoryId);
				return category ? category.icon : '';
			},
			getCategoryName(categoryId) {
				const category = this.categories.find(cat => cat.id === categoryId);
				return category ? category.name : '';
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
					categoryId: 1
				};
			},
			addTask() {
				if (!this.newTask.title.trim()) {
					uni.showToast({
						title: 'Please enter task title',
						icon: 'none'
					});
					return;
				}

				// Format time display
				const timeDisplay = this.formatTimeDisplay(this.newTask.time);

				const task = {
					id: Date.now(), // Simple unique ID
					title: this.newTask.title,
					time: timeDisplay,
					date: this.selectedDate,
					categoryId: this.categories[this.selectedCategoryIndex].id
				};

				this.tasks.push(task);

				// Update calendar day task indicators
				const calendarDay = this.calendar.find(day => day.date === this.selectedDate);
				if (calendarDay) {
					calendarDay.hasTasks = true;
				}

				this.closeTaskPopup();

				uni.showToast({
					title: 'Task added',
					icon: 'success'
				});
			},
			formatTimeDisplay(time) {
				// Convert 24h format to 12h format
				const [hours, minutes] = time.split(':');
				const hour = parseInt(hours);
				const ampm = hour >= 12 ? 'PM' : 'AM';
				const hour12 = hour % 12 || 12;
				return `${hour12}:${minutes} ${ampm}`;
			},
			deleteTask(taskId) {
				const index = this.tasks.findIndex(task => task.id === taskId);
				if (index !== -1) {
					this.tasks.splice(index, 1);

					// Check if there are still tasks for this date
					const hasRemainingTasks = this.tasks.some(task => task.date === this.selectedDate);
					if (!hasRemainingTasks) {
						const calendarDay = this.calendar.find(day => day.date === this.selectedDate);
						if (calendarDay) {
							calendarDay.hasTasks = false;
						}
					}

					uni.showToast({
						title: 'Task deleted',
						icon: 'success'
					});
				}
			},
			changeMonth(direction) {
				// This would update the calendar to show previous/next month
				// For demo purposes, we'll just show a toast
				uni.showToast({
					title: direction === 'prev' ? 'Previous month' : 'Next month',
					icon: 'none'
				});
			},
			onTimeChange(e) {
				this.selectedTimeIndex = e.detail.value;
				this.newTask.time = this.timeOptions[this.selectedTimeIndex];
			},
			onCategoryChange(e) {
				this.selectedCategoryIndex = e.detail.value;
				this.newTask.categoryId = this.categories[this.selectedCategoryIndex].id;
			},
			viewAllTasks() {
				uni.showToast({
					title: 'View all tasks',
					icon: 'none'
				});
			},
			viewAllDestinations() {
				uni.showToast({
					title: 'View all destinations',
					icon: 'none'
				});
			},
			viewActivity(activity) {
				uni.showToast({
					title: `已选择${activity.name}`,
					icon: 'none'
				});
			},
			showSearch() {
				uni.showToast({
					title: '搜索功能开发中',
					icon: '🔍'
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
			editTask(task, index) {
				this.isEditing = true;
				this.editingIndex = index;
				this.newTask = {
					title: task.title,
					time: task.time,
					categoryId: task.categoryId,
					completed: task.completed
				};
				this.selectedCategoryIndex = this.categories.findIndex(c => c.id === task.categoryId);
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
	padding: 0 15rpx 30rpx 15rpx;
	margin-bottom: 30rpx;
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
	height: 260rpx;
}

.medium {
	height: 170rpx;
}

.small {
	height: 75rpx;
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
	text-transform: uppercase;
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
	max-height: 80vh; /* 添加的任务栏高度 */
	overflow-y: auto; /* Add scrolling if needed */
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