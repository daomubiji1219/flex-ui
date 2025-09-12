# 工具函数 API

本页面提供 Flexi-UI 实用工具函数的详细 API 说明。

## 节流和防抖

### throttle 节流函数

限制函数在指定时间间隔内只能执行一次。

```typescript
import { throttle } from '@daomu/flexi-ui';

const throttledHandler = throttle(event => {
  console.log('滚动事件', event);
}, 100);

window.addEventListener('scroll', throttledHandler);
```

#### 参数

| 参数      | 类型              | 必填 | 说明                 |
| --------- | ----------------- | ---- | -------------------- |
| `func`    | `Function`        | 是   | 需要节流的函数       |
| `wait`    | `number`          | 是   | 节流间隔时间（毫秒） |
| `options` | `ThrottleOptions` | 否   | 节流选项             |

#### 选项

```typescript
interface ThrottleOptions {
  leading?: boolean; // 是否在开始时立即执行，默认 true
  trailing?: boolean; // 是否在结束时执行，默认 true
}
```

#### 返回值

返回节流后的函数，该函数具有以下方法：

- `cancel()`: 取消待执行的函数调用
- `flush()`: 立即执行待执行的函数调用

---

### debounce 防抖函数

延迟函数执行，直到停止调用一段时间后才执行。

```typescript
import { debounce } from '@daomu/flexi-ui';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// 用户输入时调用
input.addEventListener('input', e => {
  debouncedSearch(e.target.value);
});
```

#### 参数

| 参数        | 类型       | 必填 | 说明                     |
| ----------- | ---------- | ---- | ------------------------ |
| `func`      | `Function` | 是   | 需要防抖的函数           |
| `wait`      | `number`   | 是   | 延迟时间（毫秒）         |
| `immediate` | `boolean`  | 否   | 是否立即执行，默认 false |

#### 返回值

返回防抖后的函数，该函数具有以下方法：

- `cancel()`: 取消待执行的函数调用
- `flush()`: 立即执行待执行的函数调用

---

## 类型检查

### isFunction 函数检查

检查值是否为函数类型。

```typescript
import { isFunction } from '@daomu/flexi-ui';

if (isFunction(callback)) {
  callback();
}
```

#### 参数

| 参数    | 类型  | 必填 | 说明         |
| ------- | ----- | ---- | ------------ |
| `value` | `any` | 是   | 需要检查的值 |

#### 返回值

返回 `boolean`，如果是函数则为 `true`。

---

### isObject 对象检查

检查值是否为对象类型（不包括数组和 null）。

```typescript
import { isObject } from '@daomu/flexi-ui';

if (isObject(data)) {
  // 处理对象数据
}
```

#### 参数

| 参数    | 类型  | 必填 | 说明         |
| ------- | ----- | ---- | ------------ |
| `value` | `any` | 是   | 需要检查的值 |

#### 返回值

返回 `boolean`，如果是对象则为 `true`。

---

### isArray 数组检查

检查值是否为数组类型。

```typescript
import { isArray } from '@daomu/flexi-ui';

if (isArray(data)) {
  data.forEach(item => console.log(item));
}
```

#### 参数

| 参数    | 类型  | 必填 | 说明         |
| ------- | ----- | ---- | ------------ |
| `value` | `any` | 是   | 需要检查的值 |

#### 返回值

返回 `boolean`，如果是数组则为 `true`。

---

### isEmpty 空值检查

检查值是否为空（null、undefined、空字符串、空数组、空对象）。

```typescript
import { isEmpty } from '@daomu/flexi-ui';

if (!isEmpty(userInput)) {
  processInput(userInput);
}
```

#### 参数

| 参数    | 类型  | 必填 | 说明         |
| ------- | ----- | ---- | ------------ |
| `value` | `any` | 是   | 需要检查的值 |

#### 返回值

返回 `boolean`，如果为空则为 `true`。

---

## 数组工具

### chunk 数组分块

将数组分割成指定大小的块。

```typescript
import { chunk } from '@daomu/flexi-ui';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunks = chunk(numbers, 3);
// 结果: [[1, 2, 3], [4, 5, 6], [7, 8]]
```

#### 参数

| 参数    | 类型     | 必填 | 说明           |
| ------- | -------- | ---- | -------------- |
| `array` | `T[]`    | 是   | 需要分块的数组 |
| `size`  | `number` | 是   | 每块的大小     |

#### 返回值

返回分块后的二维数组 `T[][]`。

---

### uniq 数组去重

移除数组中的重复元素。

```typescript
import { uniq } from '@daomu/flexi-ui';

const numbers = [1, 2, 2, 3, 3, 4];
const unique = uniq(numbers);
// 结果: [1, 2, 3, 4]
```

#### 参数

| 参数    | 类型  | 必填 | 说明           |
| ------- | ----- | ---- | -------------- |
| `array` | `T[]` | 是   | 需要去重的数组 |

#### 返回值

返回去重后的数组 `T[]`。

---

### uniqBy 按属性去重

根据指定属性移除数组中的重复元素。

```typescript
import { uniqBy } from '@daomu/flexi-ui';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
];
const unique = uniqBy(users, 'id');
// 结果: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### 参数

| 参数    | 类型      | 必填 | 说明             |
| ------- | --------- | ---- | ---------------- |
| `array` | `T[]`     | 是   | 需要去重的数组   |
| `key`   | `keyof T` | 是   | 用于比较的属性名 |

#### 返回值

返回去重后的数组 `T[]`。

---

## 对象工具

### pick 选择属性

从对象中选择指定的属性。

```typescript
import { pick } from '@daomu/flexi-ui';

const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 };
const basicInfo = pick(user, ['name', 'email']);
// 结果: { name: 'Alice', email: 'alice@example.com' }
```

#### 参数

| 参数     | 类型          | 必填 | 说明               |
| -------- | ------------- | ---- | ------------------ |
| `object` | `T`           | 是   | 源对象             |
| `keys`   | `(keyof T)[]` | 是   | 要选择的属性名数组 |

#### 返回值

返回包含选定属性的新对象。

---

### omit 排除属性

从对象中排除指定的属性。

```typescript
import { omit } from '@daomu/flexi-ui';

const user = {
  id: 1,
  name: 'Alice',
  password: '123456',
  email: 'alice@example.com',
};
const safeUser = omit(user, ['password']);
// 结果: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

#### 参数

| 参数     | 类型          | 必填 | 说明               |
| -------- | ------------- | ---- | ------------------ |
| `object` | `T`           | 是   | 源对象             |
| `keys`   | `(keyof T)[]` | 是   | 要排除的属性名数组 |

#### 返回值

返回排除指定属性后的新对象。

---

### merge 深度合并

深度合并多个对象。

```typescript
import { merge } from '@daomu/flexi-ui';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2);
// 结果: { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

#### 参数

| 参数         | 类型       | 必填 | 说明         |
| ------------ | ---------- | ---- | ------------ |
| `...objects` | `object[]` | 是   | 要合并的对象 |

#### 返回值

返回合并后的新对象。

---

## 字符串工具

### camelCase 驼峰命名

将字符串转换为驼峰命名格式。

```typescript
import { camelCase } from '@daomu/flexi-ui';

const result = camelCase('hello-world');
// 结果: 'helloWorld'
```

#### 参数

| 参数  | 类型     | 必填 | 说明             |
| ----- | -------- | ---- | ---------------- |
| `str` | `string` | 是   | 需要转换的字符串 |

#### 返回值

返回驼峰命名格式的字符串。

---

### kebabCase 短横线命名

将字符串转换为短横线命名格式。

```typescript
import { kebabCase } from '@daomu/flexi-ui';

const result = kebabCase('helloWorld');
// 结果: 'hello-world'
```

#### 参数

| 参数  | 类型     | 必填 | 说明             |
| ----- | -------- | ---- | ---------------- |
| `str` | `string` | 是   | 需要转换的字符串 |

#### 返回值

返回短横线命名格式的字符串。

---

### capitalize 首字母大写

将字符串首字母转换为大写。

```typescript
import { capitalize } from '@daomu/flexi-ui';

const result = capitalize('hello world');
// 结果: 'Hello world'
```

#### 参数

| 参数  | 类型     | 必填 | 说明             |
| ----- | -------- | ---- | ---------------- |
| `str` | `string` | 是   | 需要转换的字符串 |

#### 返回值

返回首字母大写的字符串。

---

## 数字工具

### clamp 数值限制

将数值限制在指定范围内。

```typescript
import { clamp } from '@daomu/flexi-ui';

const result = clamp(15, 0, 10);
// 结果: 10
```

#### 参数

| 参数     | 类型     | 必填 | 说明           |
| -------- | -------- | ---- | -------------- |
| `number` | `number` | 是   | 需要限制的数值 |
| `min`    | `number` | 是   | 最小值         |
| `max`    | `number` | 是   | 最大值         |

#### 返回值

返回限制在范围内的数值。

---

### random 随机数

生成指定范围内的随机数。

```typescript
import { random } from '@daomu/flexi-ui';

const result = random(1, 10);
// 结果: 1-10 之间的随机数
```

#### 参数

| 参数       | 类型      | 必填 | 说明                       |
| ---------- | --------- | ---- | -------------------------- |
| `min`      | `number`  | 是   | 最小值                     |
| `max`      | `number`  | 是   | 最大值                     |
| `floating` | `boolean` | 否   | 是否返回浮点数，默认 false |

#### 返回值

返回指定范围内的随机数。

---

## 日期工具

### formatDate 日期格式化

格式化日期为指定格式的字符串。

```typescript
import { formatDate } from '@daomu/flexi-ui';

const date = new Date();
const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
// 结果: '2024-01-15 14:30:25'
```

#### 参数

| 参数     | 类型     | 必填 | 说明             |
| -------- | -------- | ---- | ---------------- |
| `date`   | `Date`   | 是   | 需要格式化的日期 |
| `format` | `string` | 是   | 格式化模板       |

#### 格式化标记

| 标记   | 说明         | 示例  |
| ------ | ------------ | ----- |
| `YYYY` | 四位年份     | 2024  |
| `MM`   | 两位月份     | 01-12 |
| `DD`   | 两位日期     | 01-31 |
| `HH`   | 24小时制小时 | 00-23 |
| `mm`   | 分钟         | 00-59 |
| `ss`   | 秒钟         | 00-59 |

#### 返回值

返回格式化后的日期字符串。

---

### isValidDate 日期验证

检查值是否为有效的日期对象。

```typescript
import { isValidDate } from '@daomu/flexi-ui';

const isValid = isValidDate(new Date());
// 结果: true
```

#### 参数

| 参数   | 类型  | 必填 | 说明         |
| ------ | ----- | ---- | ------------ |
| `date` | `any` | 是   | 需要检查的值 |

#### 返回值

返回 `boolean`，如果是有效日期则为 `true`。

---

## URL 工具

### parseQuery 解析查询参数

解析 URL 查询字符串为对象。

```typescript
import { parseQuery } from '@daomu/flexi-ui';

const params = parseQuery('?name=Alice&age=25');
// 结果: { name: 'Alice', age: '25' }
```

#### 参数

| 参数    | 类型     | 必填 | 说明       |
| ------- | -------- | ---- | ---------- |
| `query` | `string` | 是   | 查询字符串 |

#### 返回值

返回解析后的参数对象。

---

### stringifyQuery 序列化查询参数

将对象序列化为查询字符串。

```typescript
import { stringifyQuery } from '@daomu/flexi-ui';

const query = stringifyQuery({ name: 'Alice', age: 25 });
// 结果: 'name=Alice&age=25'
```

#### 参数

| 参数     | 类型                  | 必填 | 说明     |
| -------- | --------------------- | ---- | -------- |
| `params` | `Record<string, any>` | 是   | 参数对象 |

#### 返回值

返回序列化后的查询字符串。

---

## 使用示例

### 组合使用

```typescript
import { debounce, throttle, isEmpty, formatDate } from '@daomu/flexi-ui';

// 搜索功能
const handleSearch = debounce((query: string) => {
  if (!isEmpty(query)) {
    performSearch(query);
  }
}, 300);

// 滚动监听
const handleScroll = throttle(() => {
  const scrollTop = window.pageYOffset;
  updateScrollIndicator(scrollTop);
}, 100);

// 日志记录
const logEvent = (event: string) => {
  const timestamp = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
  console.log(`[${timestamp}] ${event}`);
};
```

### 类型安全

```typescript
// 使用泛型确保类型安全
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

const users: User[] = [
  // ... 用户数据
];

// 类型安全的属性选择
const userSummaries = users.map(
  user => pick(user, ['id', 'name']) // TypeScript 会检查属性名
);

// 类型安全的去重
const uniqueUsers = uniqBy(users, 'id');
```

---

更多工具函数的使用示例请参考各组件的实现代码。
