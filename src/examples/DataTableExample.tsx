// // src/examples/DataTableExample.tsx
// import React from 'react'
// import { DataTable, type Column } from '../compoents/DataTable/DataTable'

// // 示例数据类型
// interface User extends Record<string, unknown> {
//   id: number
//   name: string
//   email: string
//   age: number
//   department: string
//   salary: number
//   status: 'active' | 'inactive'
//   joinDate: string
// }

// // 生成示例数据
// const generateSampleData = (): User[] => {
//   const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
//   const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

//   return Array.from({ length: 100 }, (_, index) => ({
//     id: index + 1,
//     name: `User ${index + 1}`,
//     email: `user${index + 1}@example.com`,
//     age: Math.floor(Math.random() * 40) + 25,
//     department: departments[Math.floor(Math.random() * departments.length)],
//     salary: Math.floor(Math.random() * 50000) + 50000,
//     status: statuses[Math.floor(Math.random() * statuses.length)],
//     joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
//   }))
// }

// const DataTableExample: React.FC = () => {
//   const [data] = React.useState<User[]>(generateSampleData())
//   const [selectedRows, setSelectedRows] = React.useState<User[]>([])

//   // 定义列配置
//   const columns: Column<User>[] = [
//     {
//       key: 'id',
//       title: 'ID',
//       width: 80,
//       sortable: true,
//       render: (value) => <span className="font-mono text-sm">{value}</span>
//     },
//     {
//       key: 'name',
//       title: '姓名',
//       width: 120,
//       sortable: true,
//       filterable: true,
//       render: (value) => <span className="font-medium">{value}</span>
//     },
//     {
//       key: 'email',
//       title: '邮箱',
//       width: 200,
//       sortable: true,
//       filterable: true,
//       render: (value) => <span className="text-blue-600">{value}</span>
//     },
//     {
//       key: 'age',
//       title: '年龄',
//       width: 80,
//       sortable: true,
//       render: (value) => <span className="text-center block">{value}</span>
//     },
//     {
//       key: 'department',
//       title: '部门',
//       width: 120,
//       sortable: true,
//       filterable: true,
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value === 'Engineering' ? 'bg-blue-100 text-blue-800' :
//           value === 'Marketing' ? 'bg-green-100 text-green-800' :
//           value === 'Sales' ? 'bg-yellow-100 text-yellow-800' :
//           value === 'HR' ? 'bg-purple-100 text-purple-800' :
//           'bg-gray-100 text-gray-800'
//         }`}>
//           {value}
//         </span>
//       )
//     },
//     {
//       key: 'salary',
//       title: '薪资',
//       width: 120,
//       sortable: true,
//       render: (value) => (
//         <span className="font-medium text-green-600">
//           ${(value as number).toLocaleString()}
//         </span>
//       )
//     },
//     {
//       key: 'status',
//       title: '状态',
//       width: 100,
//       sortable: true,
//       filterable: true,
//       render: (value) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {value === 'active' ? '活跃' : '非活跃'}
//         </span>
//       )
//     },
//     {
//       key: 'joinDate',
//       title: '入职日期',
//       width: 120,
//       sortable: true,
//       render: (value) => <span className="text-gray-600">{value}</span>
//     }
//   ]

//   const handleRowSelect = React.useCallback((rows: User[]) => {
//     setSelectedRows(rows)
//     console.log('Selected rows:', rows)
//   }, [])

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">DataTable 示例</h1>
//         <p className="text-gray-600">
//           这是一个功能完整的数据表格组件示例，支持排序、过滤、分页、行选择和虚拟滚动。
//         </p>
//       </div>

//       {/* 选中行信息 */}
//       {selectedRows.length > 0 && (
//         <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="text-sm font-medium text-blue-900 mb-2">
//             已选中 {selectedRows.length} 行:
//           </h3>
//           <div className="text-sm text-blue-700">
//             {selectedRows.map(row => row.name).join(', ')}
//           </div>
//         </div>
//       )}

//       {/* 功能说明 */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium text-gray-900 mb-1">排序</h3>
//           <p className="text-sm text-gray-600">点击列标题进行排序</p>
//         </div>
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium text-gray-900 mb-1">过滤</h3>
//           <p className="text-sm text-gray-600">在可过滤列中输入关键词</p>
//         </div>
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium text-gray-900 mb-1">选择</h3>
//           <p className="text-sm text-gray-600">使用复选框选择行</p>
//         </div>
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium text-gray-900 mb-1">分页</h3>
//           <p className="text-sm text-gray-600">底部分页导航</p>
//         </div>
//       </div>

//       {/* DataTable 组件 */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <DataTable<User>
//           data={data}
//           columns={columns}
//           rowKey="id"
//           pagination={{pageSize:10}}
//           // pageSize={10}
//           loading={false}
//           selectable={true}
//           virtualScroll={true}
//           height={600}
//           onRowSelect={handleRowSelect}
//           className="w-full"
//         />
//       </div>

//       {/* 数据统计 */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">总用户数</h3>
//           <p className="text-3xl font-bold text-blue-600">{data.length}</p>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">活跃用户</h3>
//           <p className="text-3xl font-bold text-green-600">
//             {data.filter(user => user.status === 'active').length}
//           </p>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">已选中</h3>
//           <p className="text-3xl font-bold text-purple-600">{selectedRows.length}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DataTableExample
