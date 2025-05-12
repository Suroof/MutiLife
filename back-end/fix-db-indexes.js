/**
 * 修复数据库索引脚本
 *
 * 此脚本会删除用户集合中潜在存在问题的索引，然后重新创建正确的索引
 * 特别是将email字段的唯一索引修改为稀疏索引，以便允许多个文档的email字段为null
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// 获取MongoDB连接URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mutilife';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

console.log('开始修复索引...');
console.log(`MongoDB URI: ${MONGODB_URI}`);
console.log(`数据库名称: ${DB_NAME}`);

async function fixIndexes() {
  let client;

  try {
    // 连接到MongoDB
    console.log('连接到MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB连接成功');

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // 获取当前索引
    console.log('获取当前索引...');
    const currentIndexes = await usersCollection.indexes();
    console.log('当前索引:', JSON.stringify(currentIndexes, null, 2));

    // 删除email索引（如果存在）
    try {
      console.log('尝试删除现有email索引...');
      await usersCollection.dropIndex('email_1');
      console.log('成功删除email索引');
    } catch (error) {
      if (error.code === 27) {
        console.log('索引不存在，无需删除');
      } else {
        console.error('删除索引时出错:', error);
      }
    }

    // 创建新的稀疏唯一索引
    console.log('创建新的稀疏唯一索引...');
    await usersCollection.createIndex(
      { email: 1 },
      {
        unique: true,
        sparse: true,  // 稀疏索引只会索引存在email字段的文档
        background: true
      }
    );
    console.log('成功创建稀疏唯一索引');

    // 验证更新后的索引
    console.log('获取更新后的索引...');
    const updatedIndexes = await usersCollection.indexes();
    console.log('更新后的索引:', JSON.stringify(updatedIndexes, null, 2));

    console.log('索引修复完成!');
  } catch (error) {
    console.error('修复索引时出错:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB连接已关闭');
    }
  }
}

// 执行修复
fixIndexes();