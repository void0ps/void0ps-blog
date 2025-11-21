---
title: LummaC2 v4.0 反沙盒技术原理
date: 2025-11-21
tags:
  - AntiSanbox
description: 一种基于三角函数算法的检测是否存在人类鼠标平滑移动的反沙箱技术。
draft: false
---

# 技术原理
LummaC2 v4.0 使用了一种**新颖的反沙盒**技术，强制恶意软件等待，直到在受感染的机器中检测到“人类”行为。该技术会考虑短时间内**光标的不同位置**来检测人类活动， **从而有效地阻止了大多数无法真实模拟鼠标移动的分析系统触发爆炸** 。

恶意软件首先使用 _GetCursorPos()_ 获取光标的**初始位置** ，然后循环等待 **300** 毫秒，直到捕获的新光标位置与初始位置不同。

一旦检测到鼠标移动（因为光标位置发生了变化），它将保存光标的接下来的 **5 个位置，** 执行 _GetCursorPos()_ ，并在它们之间进行 **50** 毫秒的短暂_休眠_ 。

保存这 5 个光标位置后（我们暂且将它们命名为 **P0、P1、…、P4** ），恶意软件会检查每个捕获的位置是否与前一个位置不同。例如，它会检查是否满足 ((P0 != P1) && (P1!= P2) && (P2 != P3) && (P3 != P4))。如果不满足此条件，LummaC2 v4.0 将重新开始捕获新的“初始位置”，并_休眠_ 300 毫秒，直到发现鼠标移动，然后保存新的 5 个光标位置。此过程将**一直**重复，直到所有连续的光标位置都**不同**。

假设我们有 5 个捕获的光标位置（它们之间间隔 50 毫秒），分别命名为 P0、P1、...、P4。
![](public/images/反沙箱_2025-09-27%201.png)
LummaC2 会将这些坐标点视为欧几里得向量。因此，捕获的鼠标位置会形成 **4 个不同的向量** ：P01、P12、P23、P34。
![](public/images/反沙箱_1758940845108%201.png)
LummaC2 v4.0 随后会依次计算[连续向量 P01-P12、P12-P23 和 P23-P34 之间](https://www.cuemath.com/geometry/angle-between-vectors/)形成的角度。以下是计算不同角度的示例：
![](public/images/反沙箱_1758940994049%201.png)
# 代码展示
```c
// LummaC2 v4.0 反沙盒技术参数

#define MAX_POSITIONS 5

#define ANGLE_THRESHOLD 45.0           // 45度角度阈值 (在恶意软件中硬编码)

#define INITIAL_WAIT_TIME 300          // 300毫秒等待时间来检测初始移动

#define POSITION_CAPTURE_INTERVAL 50   // 50毫秒间隔捕获位置

#define PI 3.14159265359

  

// 预计算的余弦值 - 性能优化关键

#define COS_45_DEGREES 0.7071067811865476   // cos(45°) ≈ 0.707

  

/*

 * LummaC2 v4.0 反沙盒技术原理 (角度检测版本):

 * ===========================================

 * 1. 获取光标初始位置 (GetCursorPos)

 * 2. 循环等待300ms直到检测到鼠标移动

 * 3. 连续捕获5个光标位置，每个间隔50ms (P0, P1, P2, P3, P4)

 * 4. 验证所有连续位置都不相同 ((P0 != P1) && (P1 != P2) && (P2 != P3) && (P3 != P4))

 * 5. 将位置视为欧几里得向量，形成4个向量: P01, P12, P23, P34

 * 6. 计算连续向量间的角度: cos(θ) = (A·B) / (|A|×|B|), θ = acos(cos_value)

 * 7. 将弧度转换为角度: degrees = radians × 180/π

 * 8. 检查所有角度是否 < 45°，如果是则判定为人类行为，否则重新检测

 *

 * 这种技术使用完整的三角函数计算，提供精确的角度分析

 * 有效对抗大多数无法真实模拟平滑鼠标移动的沙盒环境

 */

  

typedef struct {

    int x;

    int y;

} MousePosition;

  

typedef struct {

    double x;

    double y;

} Vector2D;

  

/**

 * 获取当前鼠标位置

 */

bool GetMousePosition(MousePosition* pos) {

    POINT point;

    if (GetCursorPos(&point)) {

        pos->x = point.x;

        pos->y = point.y;

        return true;

    }

    return false;

}

  

/**

 * 计算两点之间的向量

 */

Vector2D CalculateVector(MousePosition pos1, MousePosition pos2) {

    Vector2D vector;

    vector.x = pos2.x - pos1.x;

    vector.y = pos2.y - pos1.y;

    return vector;

}

  

/**

 * 计算两个向量之间的角度(以度为单位)

 */

double CalculateAngle(Vector2D v1, Vector2D v2) {

    // 计算向量的点积

    double dot_product = v1.x * v2.x + v1.y * v2.y;

    // 计算向量的模长

    double magnitude1 = sqrt(v1.x * v1.x + v1.y * v1.y);

    double magnitude2 = sqrt(v2.x * v2.x + v2.y * v2.y);

    // 避免除零

    if (magnitude1 == 0.0 || magnitude2 == 0.0) {

        return 0.0;

    }

    // 计算余弦值

    double cos_angle = dot_product / (magnitude1 * magnitude2);

    // 确保余弦值在有效范围内

    if (cos_angle > 1.0) cos_angle = 1.0;

    if (cos_angle < -1.0) cos_angle = -1.0;

    // 计算角度(弧度转换为度数)

    double angle_radians = acos(cos_angle);

    double angle_degrees = angle_radians * 180.0 / PI;

    return angle_degrees;

}

  

/**

 * 检查鼠标移动模式是否类似人类行为

 * 基于LummaC2 v4.0反沙盒算法的精确实现

 */

bool IsHumanMouseMovement() {

    MousePosition initial_pos, current_pos;

    MousePosition positions[MAX_POSITIONS];

    int position_count = 0;

    printf("Starting LummaC2 v4.0 anti-sandbox detection...\n");

    // 步骤1: 获取光标初始位置

    if (!GetMousePosition(&initial_pos)) {

        printf("Failed to get initial mouse position\n");

        return false;

    }

    printf("Initial position: (%d, %d)\n", initial_pos.x, initial_pos.y);

    // 步骤2: 等待鼠标移动(循环300ms直到检测到移动)

    printf("Waiting for mouse movement...\n");

    while (true) {

        Sleep(INITIAL_WAIT_TIME);  // 按照LummaC2算法等待300ms

        if (!GetMousePosition(&current_pos)) {

            continue;

        }

        // 检查光标位置是否从初始位置发生变化

        if (current_pos.x != initial_pos.x || current_pos.y != initial_pos.y) {

            printf("Mouse movement detected! Starting position capture...\n");

            break;

        }

        printf("No movement detected, continuing to wait...\n");

    }

    // 步骤3: 以50ms间隔捕获接下来的5个位置

    printf("Capturing 5 cursor positions...\n");

    for (int i = 0; i < MAX_POSITIONS; i++) {

        if (!GetMousePosition(&positions[i])) {

            printf("Failed to capture position %d\n", i + 1);

            return false;

        }

        printf("Position P%d: (%d, %d)\n", i, positions[i].x, positions[i].y);

        if (i < MAX_POSITIONS - 1) {

            Sleep(POSITION_CAPTURE_INTERVAL);  // 按照算法要求，捕获间隔50ms

        }

    }

    // 步骤4: 验证所有连续位置都不同

    printf("\nVerifying position differences...\n");

    for (int i = 0; i < MAX_POSITIONS - 1; i++) {

        if (positions[i].x == positions[i + 1].x &&

            positions[i].y == positions[i + 1].y) {

            printf("Positions P%d and P%d are identical, restarting detection\n", i, i + 1);

            return IsHumanMouseMovement();  // 递归调用重新开始

        }

    }

    printf("All positions are different, proceeding with trigonometric analysis\n");

    // 步骤5: 从5个位置创建4个向量 (P01, P12, P23, P34)

    Vector2D vectors[4];

    for (int i = 0; i < 4; i++) {

        vectors[i] = CalculateVector(positions[i], positions[i + 1]);

        printf("Vector P%d%d: (%.2f, %.2f)\n", i, i + 1, vectors[i].x, vectors[i].y);

    }

    // 步骤6: 计算连续向量之间的角度

    printf("\nCalculating angles between consecutive vectors...\n");

    printf("Threshold: %.1f degrees\n", ANGLE_THRESHOLD);

    printf("Rule: angle < %.1f° → PASS (human-like), angle >= %.1f° → FAIL (non-human)\n\n",

           ANGLE_THRESHOLD, ANGLE_THRESHOLD);

    for (int i = 0; i < 3; i++) {

        // 计算角度

        double angle = CalculateAngle(vectors[i], vectors[i + 1]);

        printf("Vector pair P%d%d-P%d%d:\n", i, i + 1, i + 1, i + 2);

        printf("  📐 Calculated angle: %.2f degrees\n", angle);

        printf("  🎯 Comparison: %.2f %s %.1f\n",

               angle,

               angle < ANGLE_THRESHOLD ? "<" : ">=",

               ANGLE_THRESHOLD);

        // 步骤7: 检查是否有任何角度超过45度阈值

        if (angle > ANGLE_THRESHOLD) {

            printf("  ❌ Result: FAILED - Angle exceeds threshold\n");

            printf("\nRestarting detection due to suspicious movement pattern...\n");

            return IsHumanMouseMovement();  // 递归调用重新开始

        } else {

            printf("  ✅ Result: PASSED - Smooth human-like movement\n");

        }

        printf("\n");

    }

    printf("🎉 DETECTION SUCCESS!\n");

    printf("✓ All angles are within threshold (< %.1f degrees)\n", ANGLE_THRESHOLD);

    printf("✓ Human-like mouse behavior pattern confirmed!\n");

    return true;

}

```

