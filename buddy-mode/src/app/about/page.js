import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>안녕하세요, Next.js!</h1>
            <p>이것은 첫 번째 Next.js 페이지입니다.</p>
        </div>
    );
}
