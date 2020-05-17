import {getRequest} from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(resp => {
        if (resp.status === 20000402) {
            window.sessionStorage.removeItem('user');
            window.localStorage.removeItem('token');
            // 用户没登录，跳转至登录页面
            router.replace('/');
        } else if (resp.status === 200) {
            let fmtRoutes = formatRoutes(resp.obj);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
            store.dispatch('connect');
        }
    })
}
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("User")) {
                    require(['../views/user/' + component + '.vue'], resolve);
                } else if (component.startsWith("Dep")) {
                    require(['../views/dep/' + component + '.vue'], resolve);
                } else if (component.startsWith("Pos")) {
                    require(['../views/pos/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}