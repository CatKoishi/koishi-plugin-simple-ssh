import { Context, Schema } from 'koishi'
import { NodeSSH, Config as ConfigSSH, SSHExecCommandResponse } from 'node-ssh'

export const name = 'simple-ssh'

export const usage = `
# ⚠️SSH功能涉及服务器安全问题，请务必对指令权限进行严格管理
# ⚠️本插件仅供学习参考，任何由本插件造成的损失，插件本人概不负责

提供十分简易的远程连接SSH执行指令的功能

连接SSH之后发送 exit 退出

## ☎️联系方式
Github提issue | QQ：1194703727 | nyakoishi@qq.com
`

type ServerList = ConfigSSH & {
  nickname: string;
}

export interface Config {
  servList: ServerList[];
}

export const Config: Schema<Config> = Schema.object({
  servList: Schema.array(Schema.object({
    nickname: Schema.string().default('XX云').description('服务器昵称'),
    host: Schema.string().default('127.0.0.1').description('服务器IP'),
    port: Schema.number().default(22).min(1).max(65535).description('SSH端口'),
    username: Schema.string().description('用户名'),
    password: Schema.string().role('secret').description('密码')
  })).role('table').description('SSH服务器列表')
})

export function apply(ctx: Context, config: Config) {
  // write your plugin here
  ctx.command('ssh', 'SSH功能', {authority: 4})

  ctx.command('ssh.list', '查看SSH服务器列表')
  .action( () => {
    let str = ''
    for(let i = 0; i < config.servList.length; i++) {
      str += `${i+1}. ${config.servList[i].nickname}\r\n`
    }
    return str;
  })

  ctx.command('ssh.connect <server:string>', '连接SSH并执行指令')
  .action(async ({session}, server) => {
    const regServ = /^[1-9]\d*(f|F|服)$/;
    if(!regServ.test(server))
      return '请检查服务器编号是否为：编号f (12f)'

    let index:number = Number(server.substring(0,server.length-1));
    const maxServNum = config.servList.length;

    if(index > maxServNum || index < 1)
      return '没有这个服务器呢'

    const ssh = new NodeSSH();
    let cdir = ''
    try {
      await ssh.connect(config.servList[index-1]);
      const test = await ssh.execCommand('pwd');
      cdir = test.stdout;
      session.send(`成功连接到 ${config.servList[index-1].nickname}`)
    } catch (err) {
      return 'SSH连接错误'
    }

    let exit = false;
    let res: SSHExecCommandResponse;
    for(;!exit;) {
      await session.prompt(60000).then( async(cmd) => {
        if(!cmd || cmd === 'exit') {
          await ssh.dispose();
          await session.send('因超时或用户主动退出')
          exit = true;
          return;
        } else if(/^cd \S+$/.test(cmd)) { // cd
          cdir = cmd.substring(3, cmd.length);
        } else {
          res = await ssh.execCommand(cmd, { cwd: cdir });
          session.send(res.stdout);
        }
      })
    }
    
  })
}
