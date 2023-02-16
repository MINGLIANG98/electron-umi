/*
 * @Author: QIANMINGLIANG
 * @Date: 2022-06-15 16:53:42
 * @Description: 请填写简介
 * @memo:
 */
// todo 取字符方式可优化  fromCharCode可能会出错
let code = '';
let time: number, lastTime: number, lastCode: number, nextCode: number;

/**
 * @name  扫码事件
 * @description 处理鼠标输入事区分扫码输入还是手动输入
 * @return type：'开始扫码' | '扫码中' | '扫码结束' | '手动输入'；
 *         code?:扫码结果
 */
const scanEvent = ({
    which
}: {
    which: number;
}): {
    type: '开始扫码' | '扫码中' | '扫码结束' | '手动输入';
    code?: string;
} => {
    // console.log('输入:', String.fromCharCode(which));

    // 获取当前时间戳
    time = new Date().getTime();
    nextCode = which;

    if (lastCode != null && lastTime != null && time - lastTime <= 30) {
        // 扫码枪
        // 加lastcode防止首字母缺失
        // 输入结束which=13也访问加上最后一个字符
        code += String.fromCharCode(lastCode);
    } else if (lastCode != null && lastTime != null && time - lastTime > 100) {
        // 键盘
        code = '';
    }
    lastCode = nextCode;
    lastTime = time;
    // 键盘输入
    if (code === '') {
        return {
            type: '手动输入',
        };
    }
    // enter事件 输入结束
    if (which === 13) {
        return {
            type: '扫码结束',
            code,
        };
    }
    if (code.length === 1) {
        return {
            type: '开始扫码',
            code,
        };
    }
    return {
        type: '扫码中',
        code,
    };
};
export default scanEvent;
