'use client';

import { useState } from 'react';

type Question = {
  id: number;
  title: string;
  agreeLabel: string;
  disagreeLabel: string;
  agreeCount: number;
  disagreeCount: number;
};

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'バスタオルは毎回洗う？ それとも数回使ってから洗う？',
    agreeLabel: '毎回洗う',
    disagreeLabel: '数回使う',
    agreeCount: 62,
    disagreeCount: 38,
  },
  {
    id: 2,
    title: '大勢のから揚げに勝手にレモンをかけるの、アリ？ ナシ？',
    agreeLabel: 'アリ（気にならない）',
    disagreeLabel: 'ナシ（勝手にかけるな）',
    agreeCount: 25,
    disagreeCount: 75,
  },
  {
    id: 3,
    title: 'LINEの返信が1日来ないのは「脈なし」？ それとも「普通」？',
    agreeLabel: '脈なし',
    disagreeLabel: 'ただの放置 / 普通',
    agreeCount: 45,
    disagreeCount: 55,
  },
  {
    id: 4,
    title: 'きのこの山 vs たけのこの里、どっちが好き？',
    agreeLabel: 'きのこの山',
    disagreeLabel: 'たけのこの里',
    agreeCount: 40,
    disagreeCount: 60,
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: 'agree' | 'disagree' }>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const userVote = userAnswers[currentQuestion?.id];

  const handleVote = (isAgree: boolean) => {
    if (userVote || isFinished) return;

    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === currentIndex) {
          return {
            ...q,
            agreeCount: isAgree ? q.agreeCount + 1 : q.agreeCount,
            disagreeCount: !isAgree ? q.disagreeCount + 1 : q.disagreeCount,
          };
        }
        return q;
      })
    );

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: isAgree ? 'agree' : 'disagree',
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsFinished(false);
  };

  const calculateMajorityScore = () => {
    let majorityCount = 0;
    questions.forEach((q) => {
      const answer = userAnswers[q.id];
      if (!answer) return;

      const isAgreeMajority = q.agreeCount >= q.disagreeCount;
      if (
        (answer === 'agree' && isAgreeMajority) ||
        (answer === 'disagree' && !isAgreeMajority)
      ) {
        majorityCount++;
      }
    });

    return Math.round((majorityCount / questions.length) * 100);
  };

  const getDiagnosisMessage = (score: number) => {
    if (score >= 80) return { title: '超・標準人タイプ', desc: 'あなたの感性は世間一般とピッタリ一致！みんなの気持ちがよくわかる王道常識人です。' };
    if (score >= 50) return { title: 'バランス感覚派', desc: '基本は多数派ですが、自分だけのこだわりも持ち合わせているバランスの良いタイプ！' };
    return { title: '個性的・鬼才タイプ', desc: '世間にとらわれない独自の価値観の持ち主！あなたの選択が新しい時代を作るかも！？' };
  };

  const total = currentQuestion ? currentQuestion.agreeCount + currentQuestion.disagreeCount : 0;
  const agreePercent = total > 0 ? Math.round((currentQuestion.agreeCount / total) * 100) : 50;
  const disagreePercent = 100 - agreePercent;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent tracking-wider">
          MAJORITY DISCOVERY
        </span>
      </header>

      {!isFinished ? (
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full mb-3 flex items-center gap-2">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-cyan-400 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 flex flex-col justify-between min-h-[460px] relative">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1 rounded-full font-bold">
                  TOPIC #{currentQuestion.id}
                </span>
                <span className="text-[10px] text-slate-500 tracking-widest uppercase">SWIPE & VOTE</span>
              </div>
              
              <h1 className="text-2xl font-black mb-6 text-slate-100 leading-snug tracking-tight">
                {currentQuestion.title}
              </h1>
            </div>

            {!userVote ? (
              <div className="grid grid-cols-1 gap-3.5 my-auto">
                <button
                  onClick={() => handleVote(true)}
                  className="w-full py-5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all duration-150 rounded-2xl font-black text-base shadow-lg shadow-emerald-950/40 border border-emerald-400/20 text-white flex items-center justify-center gap-2"
                >
                  {currentQuestion.agreeLabel}
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="w-full py-5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 active:scale-95 transition-all duration-150 rounded-2xl font-black text-base shadow-lg shadow-rose-950/40 border border-rose-400/20 text-white flex items-center justify-center gap-2"
                >
                  {currentQuestion.disagreeLabel}
                </button>
              </div>
            ) : (
              <div className="space-y-5 my-auto">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">世間の回答割合</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-400">{currentQuestion.agreeLabel}</span>
                      <span className="text-emerald-400 font-mono text-sm">{agreePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${agreePercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-rose-400">{currentQuestion.disagreeLabel}</span>
                      <span className="text-rose-400 font-mono text-sm">{disagreePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${disagreePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-95 transition-all duration-150 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-950/50 text-white flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? '次の話題へスワイプ ➔' : 'あなたの多数派率を見る 🏆'}
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-500">
              <span>タップして投票</span>
              <span>世間とのズレを判定</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-indigo-500/30 text-center space-y-6 relative">
          <div className="inline-block bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-400/40 text-amber-300 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase">
            RESULT
          </div>
          
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">あなたの世間多数派率</p>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 my-2 tracking-tight">
              {calculateMajorityScore()}%
            </div>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-left">
            <h2 className="text-base font-black text-amber-400 mb-1.5">
              {getDiagnosisMessage(calculateMajorityScore()).title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {getDiagnosisMessage(calculateMajorityScore()).desc}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 active:scale-95 transition rounded-2xl font-bold text-sm text-white shadow-lg border border-slate-700"
          >
            もう一度診断する 🔄
          </button>
        </div>
      )}
    </main>
  );
}