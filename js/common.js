
/* =========================================
   全站公共交互
   js/common.js
   ========================================= */

/* -----------------------------------------
   跨页音乐：整站只有一个播放器，放在 start.html 里
   子页面只负责“告诉外壳：这一页该放哪首歌”
   ----------------------------------------- */
(function () {

    // 这一页该放哪首歌（在 <body data-bgm-track="..."> 上标记）
    const TRACK = (document.body && document.body.dataset.bgmTrack) || 'normal';

    // 不在外壳里（单独打开了某一页）→ 跳回外壳，保证音乐跨页不断
    if (window.top === window) {
        try {
            if (!sessionStorage.getItem('bgmShellBoot')) {
                sessionStorage.setItem('bgmShellBoot', '1');
                const page = location.pathname.split('/').pop() || 'index.html';
                location.replace('start.html#' + page);
                return;
            }
        } catch (e) {}

        window.__BGM_IN_SHELL = false;
        return;   // 外壳加载失败时才走本地播放的兜底逻辑
    }

    window.__BGM_IN_SHELL = true;
    window.__BGM_TRACK = TRACK;

    window.__bgmPost = function (msg) {
        try {
            window.parent.postMessage(msg, '*');
        } catch (e) {}
    };

    // 通知外壳：本页用哪首
    function notifyTrack() {
        window.__bgmPost({
            type: 'bgm:track',
            track: TRACK,
            hasToggle: !!document.getElementById('musicToggle')
        });
    }

    notifyTrack();
    window.addEventListener('load', notifyTrack);

    // 外壳回传播放状态 → 更新这一页的音乐按钮
    window.addEventListener('message', function (e) {
        const d = e.data || {};
        if (d.type === 'bgm:state') {
            paintMusicButton(d.playing);
        }
    });
})();

// 更新音乐按钮文案（图标按钮如 memory 页只切 class，不改文字）
function paintMusicButton(isPlaying) {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;

    const label = btn.querySelector('span:last-child');
    if (label) {
        label.textContent = isPlaying ? '音乐播放中' : '点击播放音乐';
    }

    btn.classList.toggle('playing', !!isPlaying);
    btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-enter');

    // 创建背景柔光
    if (!document.querySelector('.ambient-light')) {
        const light1 = document.createElement('div');
        light1.className = 'ambient-light one';

        const light2 = document.createElement('div');
        light2.className = 'ambient-light two';

        document.body.prepend(light1, light2);
    }

    // 创建全局提示气泡
    if (!document.querySelector('.toast-bubble')) {
        const toast = document.createElement('div');
        toast.className = 'toast-bubble';
        toast.id = 'globalToast';
        document.body.appendChild(toast);
    }

    // 音乐控制
    initMusic();
});

// 全局提示
let toastTimer = null;

function showToast(message, duration = 2600) {
    const toast = document.getElementById('globalToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 页面跳转
function navigateTo(url) {
    document.body.style.transition = 'opacity .45s ease-out';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = url;
    }, 450);
}

// 音乐控制 - 自动播放版本
function initMusic() {
    const audio = document.getElementById('backgroundMusic');
    const musicButton = document.getElementById('musicToggle');

    // ============ 在 start.html 外壳里：声音由外壳那个播放器负责 ============
    if (window.__BGM_IN_SHELL) {
        const post = window.__bgmPost;

        if (musicButton) {
            post({ type: 'bgm:hasToggle', value: true });
            post({ type: 'bgm:query' });

            // 捕获阶段拦截，避免旧逻辑去操作本页那个空音源
            document.addEventListener('click', function (e) {
                const hit = e.target.closest && e.target.closest('#musicToggle');
                if (!hit) return;
                e.preventDefault();
                e.stopImmediatePropagation();
                post({ type: 'bgm:toggle' });
            }, true);
        } else {
            post({ type: 'bgm:hasToggle', value: false });
        }

        return;
    }
    // ================= 下面是单独打开某一页时的原始逻辑 =================

    if (!audio) return;

    // 设置音量
    audio.volume = 0.35;

    // 尝试自动播放
    const autoPlay = async () => {
        try {
            await audio.play();
            if (musicButton) {
                musicButton.innerHTML = `
                    <span>♫</span>
                    <span>音乐播放中</span>
                `;
                musicButton.classList.add('playing');
            }
        } catch (error) {
            // 自动播放被浏览器阻止，需要用户交互
            console.log('自动播放被阻止，等待用户交互');
            if (musicButton) {
                musicButton.innerHTML = `
                    <span>♫</span>
                    <span>点击播放音乐</span>
                `;
            }
        }
    };

    // 页面加载后尝试自动播放
    autoPlay();

    // 用户首次点击页面任意位置时也尝试播放
    const tryPlayOnInteraction = () => {
        if (audio.paused) {
            autoPlay();
        }
        // 只执行一次
        document.removeEventListener('click', tryPlayOnInteraction);
        document.removeEventListener('touchstart', tryPlayOnInteraction);
    };

    document.addEventListener('click', tryPlayOnInteraction, { once: true });
    document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });

    // 音乐按钮控制
    if (musicButton) {
        musicButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            try {
                if (audio.paused) {
                    await audio.play();
                    musicButton.innerHTML = `
                        <span>♫</span>
                        <span>音乐播放中</span>
                    `;
                    musicButton.classList.add('playing');
                } else {
                    audio.pause();
                    musicButton.innerHTML = `
                        <span>♫</span>
                        <span>点击播放音乐</span>
                    `;
                    musicButton.classList.remove('playing');
                }
            } catch (error) {
                showToast('音乐播放失败，请检查音频文件');
            }
        });
    }
}

// 点击导航按钮时统一淡出
document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-navigate]');

    if (link) {
        event.preventDefault();
        navigateTo(link.dataset.navigate);
    }
});
//（注：内容由AI生成）
