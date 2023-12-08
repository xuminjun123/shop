// 动画
type AnimationType = {
  duration: number;
  timingFunc: string;
}

// 导航
type NavBarTitleType = {
  title: string; // 标题
  backgroundColor: string, // 背景
  animation?: AnimationType
}

export const useNavBarTitile = () => {
  const setNavBarTitle = (navBarTitle: NavBarTitleType): void => {
    uni.setNavigationBarTitle({
      title: navBarTitle.title
    });
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: navBarTitle.backgroundColor,
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
  }

  return {
    setNavBarTitle
  }

}