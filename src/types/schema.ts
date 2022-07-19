
import { ISyncModuleList, ILoadComponentOptions } from './portal'

// 挂载页面的协议
export interface IPageSchema extends ILoadComponentOptions {
  // 页面路径
  path: string;
  // 页面挂载地址
  remote: string;
  // 页面引入的外部依赖
  sync?: ISyncModuleList
}

export type IPagesSchema = Array<IPageSchema>

// bp 最佳实践的协议

export interface IBpNavItemCommonConfig {
  // 是否 a 标签跳走
  isLink: boolean;
  // 是否新开页
  isTargetBlank: boolean;
  // 菜单是否可见
  isShow: boolean;
  // 是否加上 new 标
  isNewTag: boolean;
}
export interface IBpNavThirdItem extends IBpNavItemCommonConfig {
  //  标题
  name: string;
  //  匹配路径
  url: string;
  // 权限字段（没配，则不做权限校验）
  authId?: number;
  //  标题的 icon
  icon: string;
  //  包含的页面
  include: string[];
}

export interface IBpNavSecondItem {
  //  标题
  groupLabel: string;
  //  标题的 icon
  icon: string;
  //  是否加上 new 标
  isNewTag: boolean;
  // 三级菜单
  groupSubNav?: IBpNavThirdItem[]
}

export interface IBpNavFirstItem extends IBpNavItemCommonConfig {
  // 名称
  name: string;
  // 匹配的路径
  url: string;
  // url(必须是下级的某个url)
  defaultUrls?: string[];
  children?: IBpNavSecondItem[]
}

export type IBpNavs = Array<IBpNavFirstItem>
