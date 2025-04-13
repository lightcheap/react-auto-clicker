import { useState, useRef } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [intervalTime, setIntervalTime] = useState(1000)
    const [goalCount, setGoalCount] = useState(10)
    const intervalRef = useRef(null)

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

    return (
        <div>
            <h1>オートクリッカー</h1>
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
            </div>
        </div>
    )
}

export default App
