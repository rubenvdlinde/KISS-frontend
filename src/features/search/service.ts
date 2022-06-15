import { ServiceResult } from "@/services";
import type { Ref } from "vue";
export type SearchResults = {
  id: string;
  title: string;
  source: string;
  content: string;
};
export function useGlobalSearch(searchString: Ref<string | undefined>) {
  return ServiceResult.success<SearchResults[]>([
    {
      id: "1234",
      title: "Hoe vraag ik toeslag aan?",
      source: "Kennisbank",
      content: `<p>Als u een toeslag wilt krijgen, dan kunt u die aanvragen met Mijn toeslagen. U hoeft een toeslag maar 1 keer
      aan te vragen. Als u aan de voorwaarden blijft voldoen, krijgt 0 de toeslag het volgendejaar vanzelf.
      Uw zorgtoeslag, huurtoeslag en kindgebonden budget kunt u nog aanvragen tot en met1 september in het
      volgendejaar. U kunt bijvoorbeeld nog zorgtoeslag over 2021 aanvragen tot en met 1 september 2022.
      Toeslag voor 2020 kunt u niet meer aanvragen.</p>
      <h2>Hebt u uitstel voor uw aangifte inkomstenbelasting? Dan hebt u meer tijd
      om toeslag aan te vragen</h2>
      <p>Als u een toeslag wilt krijgen, dan kunt u die aanvragen met Mijn toeslagen. U hoeft een toeslag maar 1 keer
      aan te vragen. Als u aan de voorwaarden blijft voldoen, krijgt 0 de toeslag het volgendejaar vanzelf.
      Uw zorgtoeslag, huurtoeslag en kindgebonden budget kunt u nog aanvragen tot en met1 september in het
      volgendejaar. U kunt bijvoorbeeld nog zorgtoeslag over 2021 aanvragen tot en met 1 september 2022.
      Toeslag voor 2020 kunt u niet meer aanvragen.</p>
      
      `,
    },
    {
      id: "5678",
      title: "Op welke toeslagen heb ik recht",
      source: "Kennisbank",
      content: "",
    },
  ]);
}
