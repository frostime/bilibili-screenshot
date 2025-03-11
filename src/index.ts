'use strict';

interface ButtonConfig {
    text: string;
    onClick: () => void;
    backgroundColor?: string;
}

// 创建按钮组容器
const createButtonGroup = () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    buttonContainer.style.transformOrigin = 'bottom right';
    buttonContainer.style.opacity = '0';
    buttonContainer.style.transform = 'scale(0.8) translateY(-10px)';
    buttonContainer.style.pointerEvents = 'none'; // 初始状态不可点击
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.bottom = '50px'; // 在折叠按钮上方留出空间
    buttonContainer.style.right = '0';
    buttonContainer.style.width = '120px'; // 设置固定宽度

    // 创建折叠/展开按钮
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '⚙️'; // 使用齿轮图标
    toggleButton.style.width = '40px';
    toggleButton.style.height = '40px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = '#00A1D6';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '20px';
    toggleButton.style.position = 'absolute';
    toggleButton.style.bottom = '0';
    toggleButton.style.right = '0';
    toggleButton.style.transition = 'transform 0.3s ease';
    toggleButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

    let isExpanded = false;

    toggleButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
            buttonContainer.style.opacity = '1';
            buttonContainer.style.transform = 'scale(1) translateY(0)';
            buttonContainer.style.pointerEvents = 'auto';
            toggleButton.style.transform = 'rotate(180deg)';
        } else {
            buttonContainer.style.opacity = '0';
            buttonContainer.style.transform = 'scale(0.8) translateY(-10px)';
            buttonContainer.style.pointerEvents = 'none';
            toggleButton.style.transform = 'rotate(0deg)';
        }
    });

    container.appendChild(buttonContainer);
    container.appendChild(toggleButton);

    return {
        container,
        buttonContainer
    };
};

// 创建单个按钮
const createButton = (config: ButtonConfig): HTMLButtonElement => {
    const button = document.createElement('button');
    button.innerText = config.text;
    button.style.padding = '8px 12px';
    button.style.backgroundColor = config.backgroundColor || '#00A1D6';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.width = '100%'; // 让按钮填满容器宽度
    button.style.whiteSpace = 'nowrap'; // 防止文字换行
    button.style.textAlign = 'center'; // 文字居中
    button.addEventListener('click', config.onClick);
    return button;
};

// 复制视频截图
const copyScreenshot = async () => {
    const video = document.querySelector('video');

    if (!video) {
        showMessage('无法找到视频元素');
        return;
    }

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (blob) {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    showMessage('截图已复制到剪贴板！');
                } catch (err) {
                    console.error('复制截图失败: ', err);
                    showMessage('复制截图失败，请检查浏览器支持的权限。');
                }
            }
        }, 'image/png');
    }
};

// 复制分享链接
const copyShareLink = async (timestamp = true) => {
    // 获取 input 元素 #check-timestamp
    const checkTimestampInput = document.querySelector('input#check-timestamp') as HTMLInputElement;

    // 如果存在且 timestamp 为 true，则设置 checked 属性
    if (timestamp === true && checkTimestampInput) {
        checkTimestampInput.click();
        checkTimestampInput.checked = true;
    }

    // 获取 button 元素 #share-btn-inner 并点击
    const shareButton = document.querySelector('button#share-btn-inner') as HTMLElement;
    if (shareButton) {
        shareButton.click();
        showMessage('复制分享链接');
    } else {
        showMessage('未找到分享按钮');
    }
};

// 消息框显示功能
const showMessage = (message: string) => {
    const messageBox = document.createElement('div');
    messageBox.innerText = message;
    messageBox.style.position = 'fixed';
    messageBox.style.bottom = '70px';
    messageBox.style.right = '20px';
    messageBox.style.zIndex = '9999';
    messageBox.style.padding = '10px 20px';
    messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageBox.style.color = '#fff';
    messageBox.style.borderRadius = '5px';
    messageBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    messageBox.style.fontSize = '14px';
    messageBox.style.transition = 'opacity 0.5s';
    messageBox.style.opacity = '1';

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.remove();
        }, 250);
    }, 1500);
};

// 初始化按钮组
const { container, buttonContainer } = createButtonGroup();

// 创建截图按钮
const screenshotButton = createButton({
    text: '截图并复制',
    onClick: copyScreenshot
});

// 创建分享链接按钮
const shareLinkButton = createButton({
    text: '复制分享链接',
    onClick: () => copyShareLink(true),
    backgroundColor: '#FF6699'
});

// 添加按钮到按钮容器
buttonContainer.appendChild(screenshotButton);
buttonContainer.appendChild(shareLinkButton);

// 将按钮组添加到页面
document.body.appendChild(container);
