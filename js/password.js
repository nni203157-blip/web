
/* =========================================
   密码解锁页面交互
   js/password.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('passwordForm');
    const input = document.getElementById('passwordInput');
    const bob = document.getElementById('bobDecoration');
    const errorBubble = document.getElementById('errorBubble');

    // 正确密码
    const CORRECT_PASSWORD = '1125';

    // 生成缓慢漂浮的爱心粒子
    const particleContainer =
        document.getElementById('particleContainer');

    function createParticles() {
        for (let i = 0; i < 16; i++) {
            const particle = document.createElement('span');

            particle.className = 'heart-particle';
            particle.textContent = '♡';

            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration =
                (13 + Math.random() * 13) + 's';

            particle.style.animationDelay =
                (-Math.random() * 20) + 's';

            particle.style.fontSize =
                (12 + Math.random() * 13) + 'px';

            particleContainer.appendChild(particle);
        }
    }

    createParticles();

    // 密码提交
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const password = input.value.trim();

        if (password === CORRECT_PASSWORD) {

            // 成功提示
            errorBubble.classList.remove('show');

            showToast('密码正确，惊喜正在开启……', 1200);

            // 禁止重复提交
            input.disabled = true;
            form.querySelector('button').disabled = true;

            // 延迟进入首页
            setTimeout(() => {
                navigateTo('index.html');
            }, 1000);

        } else {

            // 清空输入框
            input.value = '';

            // Bob 轻微摇晃
            bob.classList.remove('shake');

            // 强制重新触发动画
            void bob.offsetWidth;

            bob.classList.add('shake');

            // 显示错误气泡
            errorBubble.classList.add('show');

            // 柔和震动边框
            input.style.borderColor = '#dfa3b6';
            input.style.boxShadow =
                '0 0 0 4px rgba(234,185,200,.18)';

            setTimeout(() => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }, 900);

            setTimeout(() => {
                errorBubble.classList.remove('show');
            }, 3000);
        }
    });

    // 限制只能输入数字
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '');
    });

});
