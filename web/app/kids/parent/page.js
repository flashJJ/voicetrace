import Link from "next/link";
import KidsExitGate from "../../../components/KidsExitGate";
import { kidStories } from "../../../lib/kids";

export const metadata = {
  title: "家长说明 · 儿童模式 · 声迹",
  description: "儿童模式的适龄范围、内容边界、录音与隐私说明。",
};

export default function KidsParentPage() {
  return (
    <main className="container kids-page kids-parent-page">
      <section className="kids-hero">
        <span className="eyebrow">家长说明</span>
        <h1>给孩子听之前，先看这一页。</h1>
        <p>
          儿童模式是给 4-9 岁孩子和家长的粤语启蒙入口。它和成人模式共用故事库，
          但只展示经过筛选的适龄内容。
        </p>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>适龄与内容</h2>
        <ul>
          <li>4-6 岁：童谣、动物、短故事，建议家长带着读。</li>
          <li>6-9 岁：有选择和情节的故事，可以自己读，也可以亲子共读。</li>
          <li>鬼故事、野史和 AI 工坊不会出现在儿童模式。</li>
          <li>《清明·拜山》《光孝寺的菩提》等涉及祭祖或宗教传说，标注「家长陪同」。</li>
          <li>当前共有 {kidStories().length} 个适龄故事。</li>
        </ul>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>录音与隐私</h2>
        <ul>
          <li>录音只保存在这台设备的浏览器里，声迹服务器不接收。</li>
          <li>自动转写由浏览器语音服务完成，音频可能发送给浏览器厂商，可在录音棚关闭。</li>
          <li>删除录音会同时删除本机音频和转写，无法恢复。</li>
          <li>没有账号、没有上传、没有社交功能，也不采集儿童个人信息。</li>
        </ul>
      </section>

      <section className="kids-parent-card kids-parent-block">
        <h2>怎么管理</h2>
        <ul>
          <li>录音与转写：进入「声音档案」查看、试听、删除。</li>
          <li>换设备：先在档案页导出完整档案，再在新设备导入。</li>
          <li>回到成人模式：点右上角「家长说明」，在页面底部由家长完成确认。</li>
        </ul>
      </section>

      <div className="kids-hero-actions">
        <Link className="btn btn-primary" href="/kids">
          去儿童故事
        </Link>
        <Link className="btn btn-ghost" href="/archive">
          声音档案
        </Link>
      </div>

      <section className="kids-parent-card kids-parent-block kids-exit-section">
        <h2>离开儿童模式</h2>
        <p>为了避免孩子误点，请家长完成下面的确认。</p>
        <KidsExitGate />
      </section>
    </main>
  );
}
