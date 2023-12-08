/*
 * @Description: 
 * @param : 
 * @return: 
 * @Author: xmj
 * @Date: 2022-06-27 11:27:14
 */
import { ref, unref } from "vue";
import esList from "./index.vue";

import { listActionsType, listItem, listProps, useEslistReturn } from "./types";
function useEslist(props: listProps): useEslistReturn {
  const esListRef = ref<listActionsType | null>(null);

  function register(actions: listActionsType) {
    esListRef.value = actions;
    unref(esListRef)?.setListData(props.list);
    unref(esListRef)?.setTitle(props.title || "");
  }
  const methods: listActionsType = {
    removeItemByIndex(index: number) {
      if (esListRef.value) {
        esListRef.value.removeItemByIndex(index);
      } else {
        console.error("es-list 组件还未初始化");
      }
    },
    setListData(listData: listItem[]) {
      if (esListRef.value) {
        esListRef.value.setListData(listData);
      } else {
        console.error("es-list 组件还未初始化");
      }
    },
    setTitle(title: string) {
      if (esListRef.value) {
        esListRef.value.setTitle(title);
      } else {
        console.error("es-list 组件还未初始化");
      }
    },
  };

  return [register, methods as listActionsType];
}
export * from "./types";
export { esList, useEslist };
