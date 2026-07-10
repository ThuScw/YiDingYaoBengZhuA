import styles from './GameIntro.module.css';

export default function GameIntro() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>绷住</span>大挑战
        </h1>
        <p className={styles.subtitle}>你能忍住不笑吗？</p>

        <div className={styles.section}>
          <div className={styles.sectionIcon}>🎯</div>
          <h2 className={styles.sectionTitle}>游戏目标</h2>
          <p className={styles.sectionText}>
            面对各种搞笑内容，保持面无表情，坚持 <strong>5秒</strong> 即为胜利！
          </p>
        </div>



        <div className={styles.section}>
          <div className={styles.sectionIcon}>📹</div>
          <h2 className={styles.sectionTitle}>AI 面部检测</h2>
          <p className={styles.sectionText}>
            游戏使用摄像头实时捕捉你的面部表情，通过 AI 分析判断你是否笑了。
            <br />
            <span className={styles.hint}>放心，数据仅在你本地处理，不会上传或录制。</span>
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionIcon}>⚡</div>
          <h2 className={styles.sectionTitle}>游戏机制</h2>
          <ul className={styles.rulesList}>
            <li>
              <span className={styles.ruleNum}>1</span>
              <span>每轮播放一段搞笑素材，倒计时 7 秒</span>
            </li>
            <li>
              <span className={styles.ruleNum}>2</span>
              <span>期间保持不笑，成功则进入下一轮</span>
            </li>
            <li>
              <span className={styles.ruleNum}>3</span>
              <span>如果中途笑了，挑战结束</span>
            </li>
            <li>
              <span className={styles.ruleNum}>4</span>
              <span>连续成功的轮数就是你的 <strong>连胜次数</strong></span>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionIcon}>🏆</div>
          <h2 className={styles.sectionTitle}>排行榜</h2>
          <p className={styles.sectionText}>
            每周刷新！挑战你的最高连胜记录，和全服玩家一较高下。
            <br />
            <span className={styles.hint}>每周一 00:00 重置，新的一周新的开始。</span>
          </p>
        </div>

        <div className={styles.tipBox}>
          <span className={styles.tipIcon}>💡</span>
          <div>
            <strong>写在最后：</strong>
            如果你有好的想法，请在github上联系我→https://github.com/ThuScw
            纯娱乐，素材来自互联网。如果遇到素材版权问题请联系我！
          </div>
        </div>
      </div>
    </div>
  );
}
