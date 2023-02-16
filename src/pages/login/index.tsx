import { Button, Form, Input } from "antd";
import { connect } from 'umi';

type LoginUserType = {
    username:string,
    password:string,
}

function LoginPage(props: any) {
    const onSubmit = (values:LoginUserType) => {
        props.dispatch({
            type: "user/login",
            payload: values
        })
    }
    return (
        <Form
            layout='horizontal'
            onFinish={onSubmit}
            // footer={
            //     <Button block type='submit' color='primary' size='large'>
            //         登录
            //     </Button>
            // }
        >
            <Form.Item
                name='username'
                label='用户名'
                rules={[{ required: true, message: '姓名不能为空' }]}
            >
                <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item
                name='password'
                label='密码'
                rules={[{ required: true, message: '密码不能为空' }]}
            >
                <Input placeholder='请输入密码'  type='password' />
            </Form.Item>
        </Form>
    )
}
function mapStateToProps(state) {
    return { user: state.user.currentUser };
}
export default connect(mapStateToProps)(LoginPage);