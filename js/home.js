
/* =========================================
   礼物开箱首页交互
   js/home.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const giftStage = document.getElementById('giftStage');
    const giftTip = document.getElementById('giftTip');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const typingText = document.getElementById('typingText');
    const typingCursor = document.getElementById('typingCursor');
    const navigationSection = document.getElementById('navigationSection');

    const cowSticker = document.getElementById('cowSticker');
    const easterOverlay = document.getElementById('easterOverlay');
    const closeEaster = document.getElementById('closeEaster');

    let giftOpened = false;
    let stickerClicks = 0;
    let easterShown = false;

    const welcomeContent = '欢迎来到姐姐的11.25生日小世界';

    // =====================================
    // 1. 礼盒开启
    // =====================================

    function openGift() {

        if (giftOpened) {
            return;
        }

        giftOpened = true;

        // 礼盒打开
        giftStage.classList.add('opened');

        // 修改提示
        giftTip.textContent = '一份特别的心意，终于等到你啦';

        // 礼盒不可重复触发
        giftStage.style.cursor = 'default';
        giftStage.setAttribute('aria-label', '生日礼盒已经打开');

        // 生成爱心与香蕉粒子
        createGiftParticles();

        // 延迟显示欢迎文字
        setTimeout(() => {
            welcomeMessage.classList.add('visible');
            startTyping();
        }, 650);
    }

    giftStage.addEventListener('click', openGift);

    // 支持键盘开启
    giftStage.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGift();
        }
    });

    // =====================================
    // 2. 打字机效果
    // =====================================

    function startTyping() {

        let index = 0;

        function typeNext() {

            if (index < welcomeContent.length) {

                typingText.textContent += welcomeContent[index];

                index++;

                // 速度控制
                setTimeout(typeNext, 125);

            } else {

                // 文字完成
                typingCursor.style.display = 'none';

                // 显示四个导航入口
                setTimeout(() => {
                    navigationSection.classList.add('visible');

                    // 让页面平滑滚动到导航区域
                    setTimeout(() => {
                        navigationSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }, 250);

                }, 450);
            }
        }

        typeNext();
    }

    // =====================================
    // 3. 礼盒粒子
    // =====================================

    function createGiftParticles() {

        const container = document.getElementById('giftParticles');

        // 爱心粒子
        for (let i = 0; i < 12; i++) {

            const particle = document.createElement('span');

            particle.className = 'gift-particle';
            particle.textContent = '♡';

            particle.style.left = (25 + Math.random() * 50) + '%';
            particle.style.top = (35 + Math.random() * 35) + '%';

            particle.style.fontSize =
                (13 + Math.random() * 12) + 'px';

            particle.style.color =
                Math.random() > 0.5 ? '#e8b2c3' : '#e8c8a8';

            particle.style.animationDelay =
                (Math.random() * .8) + 's';

            container.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 3500);
        }

        // 香蕉形状 SVG 粒子
        for (let i = 0; i < 5; i++) {

            const banana = document.createElement('span');

            banana.className = 'gift-particle';

            banana.innerHTML = `
                <svg width="22" height="27"
                     viewBox="0 0 30 35"
                     xmlns="http://www.w3.org/2000/svg">

                    <path d="M5 5 Q9 22 24 23
                             Q26 23 27 18
                             Q20 30 9 27
                             Q2 23 2 7 Z"
                          fill="#f4d35d"/>

                    <path d="M5 5 Q10 24 24 23"
                          fill="none"
                          stroke="#d6aa36"
                          stroke-width="2"
                          stroke-linecap="round"/>

                </svg>
            `;

            banana.style.left = (25 + Math.random() * 50) + '%';
            banana.style.top = (35 + Math.random() * 30) + '%';
            banana.style.animationDelay =
                (Math.random() * .9) + 's';

            container.appendChild(banana);

            setTimeout(() => {
                banana.remove();
            }, 3500);
        }
    }

    // =====================================
    // 4. 小牛贴纸隐藏彩蛋
    // =====================================

    cowSticker.addEventListener('click', () => {

        stickerClicks++;

        // 点击反馈
        cowSticker.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.2) rotate(-8deg)' },
                { transform: 'scale(1)' }
            ],
            {
                duration: 350,
                easing: 'ease-out'
            }
        );

        // 点击五次触发彩蛋
        if (stickerClicks >= 5 && !easterShown) {

            easterShown = true;

            easterOverlay.classList.add('show');

            // 提示
            showToast('你发现了藏起来的小秘密！');
        }

    });

    // =====================================
    // 5. 关闭彩蛋
    // =====================================

    closeEaster.addEventListener('click', () => {
        easterOverlay.classList.remove('show');
    });

    // 点击遮罩区域关闭
    easterOverlay.addEventListener('click', (event) => {

        if (event.target === easterOverlay) {
            easterOverlay.classList.remove('show');
        }

    });

    // ESC 关闭
    document.addEventListener('keydown', (event) => {

        if (event.key === 'Escape') {
            easterOverlay.classList.remove('show');
        }

    });

});
