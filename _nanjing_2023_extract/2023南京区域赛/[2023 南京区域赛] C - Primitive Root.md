---
tags:
  - 算法/题解
  - C++
  - 待复习
source: https://codeforces.com/gym/104821/problem/C
competition: ICPC
date: 2026-05-31
---

# Primitive Root

## 💡 核心思路
把条件 $g \oplus (P-1) \equiv 1 \pmod P$ 改写后，可以把所有候选数表示成 $(kP+1)\oplus(P-1)$ 的形式。关键不在于枚举全部 $k$，而在于利用异或的值域夹逼，证明除了中间常数个 $k$ 之外，其余整段都可以直接整块计数。

## 🛠️ 算法与数据结构
- **主要算法**：数学变形 + 异或范围估计
- **时间复杂度**：$O(1)$，每组数据只检查常数个候选
- **空间复杂度**：$O(1)$

## 🧠 核心推导 / 状态转移
设

$$
g \oplus (P-1) = kP + 1 \quad (k \ge 0)
$$

由于异或是可逆的，因此：

$$
g = (kP + 1) \oplus (P-1)
$$

问题就变成统计有多少个 $k$ 满足：

$$
(kP + 1) \oplus (P-1) \le m
$$

这里用到异或的经典不等式：

$$
a-b \le a \oplus b \le a+b
$$

令 $a=kP+1,\ b=P-1$，则有：

$$
(k-1)P + 2 \le (kP + 1) \oplus (P-1) \le (k+1)P
$$

于是：

1. 当 $0 \le k \le \left\lfloor \dfrac{m}{P} \right\rfloor - 1$ 时，

$$
(kP+1)\oplus(P-1) \le (k+1)P \le m
$$

这些 $k$ 一定全部合法。

2. 当 $k \ge \left\lceil \dfrac{m}{P} \right\rceil + 1$ 时，

$$
(kP+1)\oplus(P-1) \ge (k-1)P + 2 > m
$$

这些 $k$ 一定全部不合法。

所以真正不确定的只剩下中间常数个位置，代码只检查：

$$
k=\left\lfloor \frac{m}{P} \right\rfloor,\quad \left\lfloor \frac{m}{P} \right\rfloor + 1
$$

前面那整段合法解个数直接是：

$$
\left\lfloor \frac{m}{P} \right\rfloor
$$

## ⚠️ 避坑指南 (Edge Cases)
不要暴力枚举 $k$，因为 $P,m$ 都可达 $10^{18}$。
这里统计的是 $g \le m$，不是 $kP+1 \le m$，二者不能直接等价。
`P=2` 仍然适用这套推导，代码无需额外特判。

## 📝 核心代码片段
```cpp
long long ans = m / p;     // 前面整段一定合法
long long k1 = m / p;

if (((k1 * p + 1) ^ (p - 1)) <= m) {
    ans++;
}

long long k2 = m / p + 1; // 只需再检查相邻的常数个 k
if (((k2 * p + 1) ^ (p - 1)) <= m) {
    ans++;
}

cout << ans << '\n';
```
