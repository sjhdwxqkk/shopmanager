<template>
  <el-container class="zhuye-container">
    <el-header>
      <div>
        <img src="@/assets/logo1.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏菜单区-->
        <el-menu
            :default-active="activePath"
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapsed"
            :unique-opened="true"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF">
<!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
<!--            一级菜单模板区-->
            <template slot="title">
<!--              图标-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本-->
              <span>{{ item.authName }}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧主体位置-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Zhuye",
    data() {
      return {
        //左侧菜单数据
        menuList: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        isCollapsed: false,
        activePath: ''
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      //获取所有菜单
      async getMenuList() {
        const {data: res} = await this.$http.get('menus');
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
        // console.log(res);
      },
      //点击按钮切换菜单折叠和展开
      toggleCollapse() {
        this.isCollapsed = !this.isCollapsed
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath')
      }
  }
</script>

<style scoped>
 .el-header {
   background-color: #373d41;
   display: flex;
   justify-content: space-between;
   padding-left: 0;
   align-items: center;
   color: #fff;
   font-size: 20px;
 }
 .el-header > div {
   display: flex;
   align-items: center;
 }
 .el-header > div > span {
   margin-left: 15px;
 }
 .el-aside {
   background-color: #333744;
 }
 .el-menu {
   border-right: none;
 }
 .el-main {
   background-color: #eaedf1;
 }
 .zhuye-container {
   height: 100%;
 }
 .left img{
   height: 50px;
   width: 50px;
 }
 .iconfont {
   margin-right: 10px;
 }
 .toggle-button {
   background-color: #4A5064 ;
   color: #eeeeee;
   font-size: 10px;
   line-height: 24px;
   text-align: center;
   letter-spacing: 0.2em;
   cursor: pointer;
 }
</style>