import axios from "axios"

export default function Test() {
    const handleCSRFTest = () => {
        axios.get('/sanctum/csrf-cookie').then(response=> {
            console.log(response);
        });
    }
    // 送信するデータの名称はlaravel fortifyに合わせる必要がある
    const handleSignUp = () => {
        axios.post('/api/register', {
            name: 'test user name',
            email: 'testuser@example.com',
            password: 'test_password',
            password_confirmation: 'test_password'
        }).then(response=>console.log(response));
    }
    const handleLogin = () => {
        axios.post('/api/login', {
            email: 'testuser@example.com',
            password: 'test_password'
        }).then(response=>console.log(response));
    }
    const handleGetUser = () => {
        axios.get('/api/user').then(response=>{
            console.log(response);
        });
    }
    const handleGetAdminUser = () => {
        axios.get('/api/admin/user').then(response=>{
            console.log(response);
        })
    }
    return (
        <>
            <h1>laravelとの認証テスト</h1>
            <ol>
                <li><button onClick={handleCSRFTest}>laravel側のcsrf保護を有効にする</button></li>
                <li><button onClick={handleSignUp}>ユーザー登録</button></li>
                <li><button onClick={handleLogin}>ログイン</button></li>
                <li><button onClick={handleGetUser}>認証が必要なurlにリクエスト(/api/user)</button></li>
                <li><button onClick={handleGetAdminUser}>adminが必要なurlにリクエスト(/api/admin/user)</button></li>
            </ol>
        </>
    )
}