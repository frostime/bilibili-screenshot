// ==UserScript==
// @name        bilibili-screenshot
// @description 快速获取Bilibili当前视频的截图并复制到剪贴板
// @namespace   github.com/frostime
// @match       *://www.bilibili.com/video/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @version     0.1.0
// @author      frostime
// @license     MIT
// @grant       none
// ==/UserScript==
(function () {
    'use strict';

    // 创建一个按钮
    const createButton = () => {
        const button = document.createElement('button');
        button.innerText = '截图并复制';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#00A1D6';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        return button;
    };
    const button = createButton();
    // 将按钮添加到页面
    document.body.appendChild(button);
    // 为按钮添加点击事件
    button.addEventListener('click', async () => {
        const video = document.querySelector('video');
        if (!video) {
            showMessage('无法找到视频元素');
            return;
        }
        const canvas = document.createElement('canvas');
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
                    }
                    catch (err) {
                        console.error('复制截图失败: ', err);
                        showMessage('复制截图失败，请检查浏览器支持的权限。');
                    }
                }
            }, 'image/png');
        }
    });
    // 消息框显示功能
    const showMessage = (message) => {
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

})();
//# sourceMappingURL=bundle.user.js.map
