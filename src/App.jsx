import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
    const [targetElement, setTargetElement] = useState(null) // ターゲット要素
    const [isSelecting, setIsSelecting] = useState(false) // 選択モード
    const [isAutoClicking, setIsAutoClicking] = useState(false) // 自動クリック中かどうか

    const [countA, setCountA] = useState(0) // ボタンAのクリック回数
    const [countB, setCountB] = useState(0) // ボタンBのクリック回数

    const [intervalTime, setIntervalTime] = useState(1000) // 自動クリック間隔
    const [goalCount, setGoalCount] = useState(10) // 目標クリック回数
    const intervalRef = useRef(null) // setIntervalのIDを保持するためのref

    /**
     * 自動クリックの処理
     * isAutoClickingがtrueのとき、targetElementをクリックする
     * intervalTimeの間隔でクリックする
     * targetElementがnullの場合は何もしない
     * useEffectのクリーンアップ関数でsetIntervalをクリアする
     */
    // useEffect(() => { // userEffectは、状態が変化したときに実行される
    //     let intervalId;
    //     if (isAutoClicking && targetElement) { // 自動クリック中かつターゲット要素がある場合
    //         // 自動クリックを開始
    //         intervalId = setInterval(() => {
    //             targetElement.click()
    //         }, intervalTime)
    //     }

    //     return () => clearInterval(intervalId)
    // }, [isAutoClicking, targetElement])

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


    // 自動クリックを開始する関数
    const startAutoClick = () => {
        if (intervalRef.current) return // すでに自動クリック中なら何もしない

        if (!targetElement) {
            alert('ターゲット要素が設定されていません。');
            return
        }

        // 自動クリックを開始
        intervalRef.current = setInterval(() => {
            targetElement.click()

            // setCountA((prevCount) => {
            //     if (prevCount >= goalCount) {
            //         clearInterval(intervalRef.current)
            //         intervalRef.current = null
            //         return goalCount // 目標回数に達したら停止
            //     }
            //     return prevCount + 1
            // })

            // setCountB((prevCount) => {
            //     if (prevCount >= goalCount) {
            //         clearInterval(intervalRef.current)
            //         intervalRef.current = null
            //         return goalCount // 目標回数に達したら停止
            //     }
            //     return prevCount + 1
            // })

        }, intervalTime)
    }

    /**
     * 自動クリックを停止する関数
     * intervalRef.currentがnullでない場合、clearIntervalを呼び出して自動クリックを停止する
     */
    const stopAutoClick = () => {

        if (intervalRef.current !== null) {
            // 自動クリックを停止
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    // ボタンAのクリック回数を増やす関数
    const handleClickA = () => {
        setCountA(countA + 1)
    }

    // ボタンBのクリック回数を増やす関数
    const handleClickB = () => {
        setCountB(countB + 1)
    }

    // 自動クリックの間隔を設定する関数
    const handleIntervalChange = (e) => {
        setIntervalTime(Number(e.target.value))
    }

    // 自動クリックの目標回数を設定する関数
    const handleGoalChange = (e) => {
        setGoalCount(Number(e.target.value))
    }

    // 自動クリックをクリアする関数
    const resetCount = () => {
        setCountA(0)
        setCountB(0)
        stopAutoClick()
    }

    // -----------------------------------------------
    return (
        <div>
            <h2>自由ターゲットオートクリッカー</h2>

            <p>ボタンAクリック回数: {countA}</p>
            <p>ボタンBクリック回数: {countB}</p>

            <div>
                <button onClick={handleClickA}>ボタンＡ</button>
                <button onClick={handleClickB}>ボタンＢ</button>
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
            </div>

            <button onClick={handleStateSelecting} disabled={isSelecting}>
                {isSelecting ? '選択中...' : 'ターゲット要素を選択'}
            </button>

            <button
                onClick={() => setIsAutoClicking((prev) => !prev)}
                disabled={!targetElement}
            >
                {isAutoClicking ? '自動クリック停止' : '自動クリック開始'}
            </button>


        </div >
    )
}

export default App
