import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
    const [targetElement, setTargetElement] = useState(null)
    const [isSelecting, setIsSelecting] = useState(false)
    const [isAutoClicking, setIsAutoClicking] = useState(false)

    const [count, setCount] = useState(0)
    const [intervalTime, setIntervalTime] = useState(1000)
    const [goalCount, setGoalCount] = useState(10)
    const intervalRef = useRef(null)

    useEffect(() => {
        let intervalId;
        if (isAutoClicking && targetElement) { // 自動クリック中かつターゲット要素がある場合
            // 自動クリックを開始
            intervalId = setInterval(() => {
                targetElement.click()
            }, intervalTime)
        }

        return () => clearInterval(intervalId)
    }, [isAutoClicking, targetElement])

    //
    const handleStateSelecting = () => {
        setIsSelecting(true);
    }

    const handleDocumentClick = (e) => {
        if (isSelecting) {
            e.preventDefault(); // クリックイベントのデフォルト動作を防ぐ
            e.stopPropagation(); // クリックイベントのバブリングを防ぐ
            setTargetElement(e.target); // クリックした要素をターゲットに設定
            setIsSelecting(false); // 選択モードを終了
            alert(`ターゲット要素が設定されました！`);
        }
    }

    // クリックイベントをキャプチャリングフェーズで取得するために、documentにイベントリスナーを追加
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick, true); // キャプチャリングフェーズでイベントを取得
        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [isSelecting])


    // -------
    const startAutoClick = () => {
        if (intervalRef.current) return // すでに自動クリック中なら何もしない
        // 自動クリックを開始
        intervalRef.current = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount >= goalCount) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                    return goalCount // 目標回数に達したら停止
                }
                return prevCount + 1
            })
        }, intervalTime)
    }

    const stopAutoClick = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handleClick = () => {
        setCount(count + 1)
    }

    const handleIntervalChange = (e) => {
        setIntervalTime(Number(e.target.value))
    }

    const handleGoalChange = (e) => {
        setGoalCount(Number(e.target.value))
    }

    const resetCount = () => {
        setCount(0)
        stopAutoClick()
    }
    // -------

    return (
        <div>
            <h2>自由ターゲットオートクリッカー</h2>

            <button onClick={handleStateSelecting} disabled={isSelecting}>
                {isSelecting ? '選択中...' : 'ターゲット要素を選択'}
            </button>

            <button
                onClick={() => setIsAutoClicking((prev) => !prev)}
                disabled={!targetElement}
            >
                {isAutoClicking ? '自動クリック停止' : '自動クリック開始'}
            </button>

            <div>
                {/* テスト用のクリック対象要素 */}
                <button onClick={() => alert('ボタンAがクリックされました!')}>ボタンＡ</button>
                <button onClick={() => alert('ボタンBがクリックされました!')}>ボタンＢ</button>
            </div>


            {/* <h2>オートクリッカー</h2>
            <p>クリック回数: {count}</p>

            <div className="card">
                <button onClick={handleClick}>
                    クリック
                </button>
            </div>

            <div className="card">
                <label>
                    自動クリック間隔 (ミリ秒):
                    <input
                        type="number"
                        value={intervalTime}
                        onChange={handleIntervalChange}
                        min="40"
                    />
                </label>
            </div>

            <div className="card">
                <label>
                    目標クリック回数:
                    <input
                        type="number"
                        value={goalCount}
                        onChange={handleGoalChange}
                        min="1"
                    />
                </label>
            </div>

            <div className="card">
                <button onClick={startAutoClick}>
                    自動クリック開始
                </button>
                <button onClick={stopAutoClick}>
                    自動クリック停止
                </button>
                <button onClick={resetCount}>
                    リセット
                </button>
            </div> */}

        </div>
    )
}

export default App
