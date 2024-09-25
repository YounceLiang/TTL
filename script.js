document.getElementById('customerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cooperationCity = document.getElementById('cooperationCity')?.value;
    const cooperationContent = document.getElementById('cooperationContent')?.value;

    if (!cooperationCity || !cooperationContent) {
        alert('请填写所有必填字段');
        return;
    }

    // 显示加载指示器
    document.getElementById('loadingIndicator').style.display = 'inline';

    const prompt = `
    # 你是内容营销专员，精通快消品供应链物流，任务是把用户提供的口语化句子改成意思相同的专业化句子。
    要求用简短的词组概括业务场景、痛点和解决方案的核心内容，保持每个场景结构统一。

    ## 你改写过的案例：

    口语化句子
    ---
    痛点：
     1、销售增长仓储容积不足（2个月内门店从20家增长至32家，月出货量增长1.7万箱（原4.2万箱），仓库面积容量不足以支持增长） 
    2、淡旺季波动下物流弹性差（货量波峰波谷无法调配；自有人力与设备，面对爆单缺乏补充资源；精力不足，销售受限）
    3、作业效率及自动化水平低（数智运营系统无使用；库内无自动化设备；固定人力作业效率低）

    解决方案：
     1、仓库规划（高标仓库选址；多工具支持仓库规划；物流数字化分析支持）
     2、物流资源弹性配置（同城市多仓人力设备支持；区域各DC仓跨城应急支持；全国仓网资源提供跨区业务开发支持） 
    3、标准化智慧仓库管理（WMS、TMS+车载系统；标准SOP营运流程；作业人员计件制度）
    ---

    专业化句子：
    ---
    痛点：
    1. 仓储容量严重不足：月出货量激增40%，现有仓库已无法满足需求
    2. 资源缺乏弹性：自有设备人力固定，旺季缺乏资源，淡季闲置资源
    3. 仓储效率低下：缺乏数字化系统，自动化程度低，人工作业效率低
    4.物流瓶颈制约销售：精力过度消耗于物流管理，影响业务拓展

    解决方案：
    1. 优化仓储布局：科学选址，空间规划，数据驱动决策
    2. 构建弹性物流网络：多仓协同，区域调配，全国资源整合
    3. 实施智慧仓储管理：WMS/TMS/车载整合，标准化流程，绩效激励
    4. 释放业务潜能：物流外包，聚焦核心业务，加速市场拓展
    ---

    ## 你的任务是把以下用户提供的口语化句子改写为意思相同的专业化句子并输出
    - 客户痛点模糊表述：${cooperationCity}
    - 解决方案模糊表述：${cooperationContent}

    请分别输出"客户痛点专业表述："和"解决方案专业表述："。
    每个要点请用数字编号，并在每个要点之间换行。
    `;

    try {
        const response = await fetch('https://drymundanequadrant.younceliang.repl.co/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "glm-4",
                messages: [
                    {"role": "user", "content": prompt}
                ]
            })
        });

        if (!response.ok) {
            throw new Error('网络响应不正常');
        }

        const data = await response.json();
        console.log('Response data:', data);
        const content = data.choices[0].message.content;

        // 分割内容并放入相应的输出框
        const [painPointsOutput, solutionsOutput] = content.split('解决方案专业表述：');
        
        const outputPainPoints = document.getElementById('outputPainPoints');
        outputPainPoints.innerHTML = formatOutput(painPointsOutput.replace('客户痛点专业表述：', '').trim());

        const outputSolutions = document.getElementById('outputSolutions');
        outputSolutions.innerHTML = formatOutput(solutionsOutput.trim());

    } catch (error) {
        console.error('错误:', error);
        alert('生成时发生错误,请稍后再试。');
    } finally {
        // 无论成功还是失败，都隐藏加载指示器
        document.getElementById('loadingIndicator').style.display = 'none';
    }
});

function formatOutput(text) {
    // 将每个编号的项目转换为HTML列表项
    let formattedText = text.replace(/(\d+\.)\s*(.+?)(?=\n\d+\.|\n*$)/g, '<li>$1 $2</li>');
    
    // 如果文本以数字和点开头，将整个文本包裹在有序列表中
    if (/^\d+\./.test(formattedText)) {
        formattedText = '<ol>' + formattedText + '</ol>';
    }
    
    // 替换换行符为<br>标签
    return formattedText.replace(/\n/g, '<br>');
}
