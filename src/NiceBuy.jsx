import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Save, RotateCcw, Sparkles } from "lucide-react";

// ─── 価値観分析ロジック ────────────────────────────────────────────────────
function analyzeValues({ q2, q3, q4 }) {
  const axisMap = {
    ビジュアル: { label: "美学的", def: "「美しさ」を機能と同等に扱う審美眼" },
    機能面:     { label: "機能的", def: "本質的な価値に投資する合理的な直感" },
    安さ:       { label: "合理的", def: "コストパフォーマンスを最大化する戦略眼" },
    ブランド:   { label: "象徴的", def: "ブランドと物語を纏うことで自己を定義する感性" },
  };
  const selfMap = {
    余裕: "余白と効率の中に美しさを見出す",
    自信: "所有を通じて自己を表現する",
    没入: "深い集中と純粋な体験を求める",
  };

  const axis      = axisMap[q2] ?? { label: "複合的", def: "複数の軸を統合し、独自の判断基準を持つ審美眼" };
  const selfDesc  = selfMap[q3] ?? `「${q3}」という感覚の中に自己を見つける`;
  const destinyNote =
    q4 === "運命"
      ? "直感と確信で選ぶ「一点買い型」"
      : "過程と結果を両立させる「戦略型」";

  return {
    axis: axis.label,
    statement: `あなたが大切にしているのは、${axis.def}です。\n${selfDesc}こと、そして${destinyNote}──これがあなたの「買い物の美学」の核心です。`,
  };
}

// ─── アニメーション variants ──────────────────────────────────────────────
const stepVariants = {
  enter:  { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0,   transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.28, ease: "easeIn" } },
};

const echoVariants = {
  hidden:  { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
};

// ─── 共通パーツ ───────────────────────────────────────────────────────────
function StepNum({ current, total, label }) {
  return (
    <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-mono">
      {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")} — {label}
    </p>
  );
}

function Question({ children }) {
  return (
    <h2
      className="font-serif text-[20px] leading-[1.75] tracking-[0.02em] text-[#e8e4dc]"
      style={{ fontFamily: "'Shippori Mincho', serif" }}
    >
      {children}
    </h2>
  );
}

function Echo({ text }) {
  if (!text) return <div className="h-5" />;
  return (
    <motion.p
      key={text}
      variants={echoVariants}
      initial="hidden"
      animate="visible"
      className="text-[13px] italic tracking-[0.05em] text-white/35 h-5"
      style={{ fontFamily: "'Shippori Mincho', serif" }}
    >
      {text}
    </motion.p>
  );
}

function ChoiceBtn({ label, sub, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3.5 rounded border text-[12px] tracking-[0.05em] font-mono
        transition-all duration-200
        ${selected
          ? "bg-white/10 border-white/50 text-[#e8e4dc]"
          : "bg-white/[0.04] border-white/12 text-white/70 hover:bg-white/[0.08] hover:border-white/30 hover:text-[#e8e4dc]"
        }`}
    >
      {label && (
        <span className="block text-[10px] tracking-[0.12em] uppercase text-white/35 mb-1">
          {label}
        </span>
      )}
      <span className="block text-[13px]">{sub}</span>
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-6 py-2.5 rounded-[2px] font-mono text-[11px]
        tracking-[0.15em] uppercase transition-all duration-200
        border border-white/15 text-white/30 hover:border-white/30 hover:text-white/60 cursor-pointer"
    >
      <ArrowLeft size={13} /> 戻る
    </motion.button>
  );
}

function NextBtn({ disabled, onClick, label = "次へ" }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-[2px] font-mono text-[11px]
        tracking-[0.15em] uppercase transition-all duration-200
        ${disabled
          ? "bg-white/20 text-black/40 cursor-not-allowed"
          : "bg-[#e8e4dc] text-[#0a0a08] hover:bg-white cursor-pointer"
        }`}
    >
      {label} <ArrowRight size={13} />
    </motion.button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────
function Step1({ answers, onChange, onNext }) {
  const [echo, setEcho] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = (e) => {
    onChange({ q1: e.target.value });
    if (e.target.value.trim().length > 2) setEcho("なるほど、それは素敵な選択ですね。");
    else setEcho("");
  };

  const valid = answers.q1.trim().length > 0;

  return (
    <div className="flex flex-col gap-7">
      <StepNum current={1} total={5} label="アイテム" />
      <Question>最近、心から「買ってよかった」と<br />思ったものは何ですか？</Question>
      <input
        ref={inputRef}
        value={answers.q1}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && valid && onNext()}
        placeholder="例：ワイヤレスイヤホン、観葉植物、革の財布..."
        className="bg-transparent border-0 border-b border-white/25 focus:border-white/60
          text-[#e8e4dc] text-[17px] font-light tracking-[0.03em] py-2.5 outline-none
          placeholder:text-white/20 placeholder:text-[14px] transition-colors duration-300"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      />
      <Echo text={echo} />
      <div className="flex justify-end">
        <NextBtn disabled={!valid} onClick={onNext} />      </div>
    </div>
  );
}

function Step2({ answers, onChange, onNext, onBack }) {
  const [echo, setEcho] = useState("");

  const choices = [
    { label: "価格", sub: "安さ",       val: "安さ" },
    { label: "実用性", sub: "機能面",     val: "機能面" },
    { label: "見た目", sub: "ビジュアル", val: "ビジュアル" },
    { label: "ブランド", sub: "付加価値",   val: "ブランド" },
  ];

  const select = (val) => {
    const choice = choices.find((c) => c.val === val);
    onChange({ q2: val });
    setEcho(`なるほど、${choice.label}ですね。`);
  };

  return (
    <div className="flex flex-col gap-7">
      <StepNum current={2} total={5} label="理由" />
      <Question>その理由を、あえて絞るなら？</Question>
      <div className="grid grid-cols-2 gap-2.5">
        {choices.map((c) => (
          <ChoiceBtn
            key={c.val}
            label={c.label}
            sub={c.sub}
            selected={answers.q2 === c.val}
            onClick={() => select(c.val)}
          />
        ))}
      </div>
      <Echo text={echo} />
      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <NextBtn disabled={!answers.q2} onClick={onNext} />
      </div>
    </div>
  );
}

function Step3({ answers, onChange, onNext, onBack }) {
  const [echo, setEcho] = useState("");
  const [freeText, setFreeText] = useState("");

  const choices = [
    { label: "余裕", sub: "時短・楽",   val: "余裕" },
    { label: "自信", sub: "高揚・誇り", val: "自信" },
    { label: "没入", sub: "集中",       val: "没入" },
  ];

  const select = (val) => {
    onChange({ q3: val });
    setFreeText("");
    setEcho("それは大事な感覚です。");
  };

  const handleFree = (e) => {
  setFreeText(e.target.value);
  if (e.target.value.trim().length > 0) {
    onChange({ q3: e.target.value.trim() });
    setEcho("深いところに触れましたね。");
  } else {
    if (!["余裕", "自信", "没入"].includes(answers.q3)) {
      onChange({ q3: "" });
    }
  }
};

  return (
    <div className="flex flex-col gap-7">
      <StepNum current={3} total={5} label="理想の自分" />
      <Question>それは、どんな「理想の自分」を<br />叶えてくれましたか？</Question>
      <div className="grid grid-cols-3 gap-2.5">
        {choices.map((c) => (
          <ChoiceBtn
            key={c.val}
            label={c.label}
            sub={c.sub}
            selected={answers.q3 === c.val}
            onClick={() => select(c.val)}
          />
        ))}
      </div>
      <textarea
        value={freeText}
        onChange={handleFree}
        placeholder="または、自由に記述する..."
        rows={2}
        className="bg-transparent border border-white/12 focus:border-white/35 rounded
          text-[#e8e4dc] text-[16px] font-light tracking-[0.03em] p-3 outline-none resize-none
          placeholder:text-white/20 placeholder:text-[13px] transition-colors duration-300
          leading-relaxed"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      />
      <Echo text={echo} />
      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <NextBtn disabled={!answers.q3} onClick={onNext} />
      </div>
    </div>
  );
}

function Step4({ answers, onChange, onNext, onBack }) {
  const [echo, setEcho] = useState("");

  const choices = [
    { label: "はい",   sub: "これ以外ありえなかった ── 運命の出会い", val: "運命" },
    { label: "いいえ", sub: "妥協して選んだけど、結果的に正解だった", val: "正解" },
  ];

  const select = (val) => {
    onChange({ q4: val });
    setEcho("よく理解されてますね。");
  };

  return (
    <div className="flex flex-col gap-7">
      <StepNum current={4} total={5} label="決断の重さ" />
      <Question>「買わない」という選択肢は<br />ありましたか？</Question>
      <div className="flex flex-col gap-2.5">
        {choices.map((c) => (
          <ChoiceBtn
            key={c.val}
            label={c.label}
            sub={c.sub}
            selected={answers.q4 === c.val}
            onClick={() => select(c.val)}
          />
        ))}
      </div>
      <Echo text={echo} />
      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <NextBtn disabled={!answers.q4} onClick={onNext} />
      </div>
    </div>
  );
}

function Step5({ answers, onChange, onNext, onBack }) {
  const [echo, setEcho] = useState("");
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const handleChange = (e) => {
    onChange({ q5: e.target.value });
    if (e.target.value.trim().length > 3) setEcho("言葉に宿る、あなたの美学。");
    else setEcho("");
  };

  const valid = answers.q5.trim().length > 0;

  return (
    <div className="flex flex-col gap-7">
      <StepNum current={5} total={5} label="キャッチコピー" />
      <Question>そのモノに、あなただけの<br />「キャッチコピー」を付けてください</Question>
      <textarea
        ref={ref}
        value={answers.q5}
        onChange={handleChange}
        placeholder="例：「私のオキニ」「相棒」など思いつくまま書いてください。"
        rows={3}
        className="bg-transparent border border-white/12 focus:border-white/35 rounded
          text-[#e8e4dc] text-[16px] font-light tracking-[0.03em] p-3 outline-none resize-none
          placeholder:text-white/20 placeholder:text-[13px] transition-colors duration-300
          leading-relaxed"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      />
      <Echo text={echo} />
      <div className="flex justify-between items-center">
        <BackBtn onClick={onBack} />
        <NextBtn disabled={!valid} onClick={onNext} label="価値観を見る" />
      </div>
    </div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#0a0a08] z-20 flex flex-col items-center justify-center gap-5 rounded-xl"
    >
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-[15px] tracking-[0.1em] text-white/60"
        style={{ fontFamily: "'Shippori Mincho', serif" }}
      >
        価値観を分析しています...
      </motion.div>
      <div className="w-28 h-px bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-2/5 bg-white/60"
          animate={{ x: ["-100%", "250%"] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────
function ResultScreen({ answers, onRestart }) {
  const [saved, setSaved] = useState(false);
  const analysis = analyzeValues(answers);

  const handleSave = async () => {
    setSaved(true);
  };

  return (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      className="flex flex-col gap-5"
    >
      <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-mono">
        あなたの買い物価値観
      </p>

      <div
        className="text-[22px] font-semibold leading-relaxed text-[#e8e4dc] border-l-[1.5px] border-white/40 pl-4"
        style={{ fontFamily: "'Shippori Mincho', serif" }}
      >
        「{answers.q5}」
      </div>

      <p
        className="text-[14px] font-light leading-[2] text-white/75 tracking-[0.04em]"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      >
        あなたの次の
        <span className="text-[#e8e4dc] font-normal">【{answers.q5}】</span>
        を見つけるために、買い物に関する価値観がわかりました！
        <br /><br />
        {analysis.statement}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-2">
        {/* <motion.button
          onClick={handleSave}
          disabled={saved}
          whileHover={saved ? {} : { borderColor: "rgba(232,228,220,0.5)", color: "#e8e4dc" }}
          className={`flex items-center gap-2 border px-5 py-2.5 rounded-[2px] font-mono
            text-[11px] tracking-[0.1em] transition-all duration-300
            ${saved
              ? "border-white/50 text-white/60 cursor-default"
              : "border-white/20 text-white/50 cursor-pointer"
            }`}
        >
          {saved ? <Check size={12} /> : <Save size={12} />}
          {saved ? "保存しました" : "価値観を保存する"}
        </motion.button> */}

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em]
            text-white/25 hover:text-white/50 transition-colors underline underline-offset-4"
        >
          <RotateCcw size={11} />
          最初からやり直す
        </button>
      </div>
    </motion.div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────
function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            background:
              i < current
                ? "rgba(232,228,220,0.45)"
                : i === current
                  ? "#e8e4dc"
                  : "rgba(232,228,220,0.15)",
            scale: i === current ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-1.5 h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
const STEPS = [Step1, Step2, Step3, Step4, Step5];
const initialAnswers = { q1: "", q2: "", q3: "", q4: "", q5: "" };

export default function NiceBuy() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const update = (partial) => setAnswers((prev) => ({ ...prev, ...partial }));

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDone(true);
      }, 2200);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers(initialAnswers);
    setDone(false);
  };

  const StepComponent = STEPS[step];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400&family=DM+Mono:wght@300;400&family=Shippori+Mincho:wght@400;600&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#060604] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-[640px] bg-[#0a0a08] border border-white/[0.08]
            rounded-xl overflow-hidden flex flex-col"
          style={{ minHeight: 560 }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(232,228,220,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,228,220,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Loading overlay */}
          <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

          {/* Header */}
          <div className="relative flex justify-between items-center px-7 pt-5 pb-4 border-b border-white/10">
            <span
              className="text-[13px] tracking-[0.12em] text-white/50"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              それ、ナイスbuy!
            </span>
            {!done && <ProgressDots current={step} total={5} />}
            {done && (
              <div className="flex items-center gap-1 text-white/30 font-mono text-[10px] tracking-widest">
                <Sparkles size={11} /> COMPLETE
              </div>
            )}
          </div>

          {/* Main */}
          <div className="relative flex-1 flex flex-col justify-center px-7 py-8">
            <AnimatePresence mode="wait">
              {done ? (
                <ResultScreen key="result" answers={answers} onRestart={restart} />
              ) : (
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <StepComponent
                    answers={answers}
                    onChange={update}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
