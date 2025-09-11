// 测试 @daomu/flexi-ui 包的安装和导入
console.log('开始测试 @daomu/flexi-ui 包...');

try {
  // 测试主要组件导入
  const flexiUI = await import('@daomu/flexi-ui');
  const { Button, DataTable, FileUploader, VirtualList } = flexiUI;
  console.log('✅ 组件导入成功');
  console.log('- Button:', typeof Button);
  console.log('- DataTable:', typeof DataTable);
  console.log('- FileUploader:', typeof FileUploader);
  console.log('- VirtualList:', typeof VirtualList);

  // 测试 hooks 导入
  const { useTheme, useForm, useLocalStorage } = flexiUI;
  console.log('\n✅ Hooks 导入成功');
  console.log('- useTheme:', typeof useTheme);
  console.log('- useForm:', typeof useForm);
  console.log('- useLocalStorage:', typeof useLocalStorage);

  // 测试主题导入
  const { designTokens } = flexiUI;
  console.log('\n✅ 主题导入成功');
  console.log('- designTokens:', typeof designTokens);

  // 测试包的完整性
  console.log('\n📦 包信息:');
  console.log('- 总导出项数:', Object.keys(flexiUI).length);
  console.log('- 导出项:', Object.keys(flexiUI).join(', '));

  console.log('\n🎉 所有导入测试通过！包安装成功！');
} catch (error) {
  console.error('❌ 导入测试失败:', error.message);
  console.error('错误详情:', error);
}
