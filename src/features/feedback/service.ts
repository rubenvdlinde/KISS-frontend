//import { ServiceResult } from "@/services";
import type { Feedback } from "./types";

export function useFeedbackService() {
  if (!window.gatewayBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  const feedbackUrl = window.gatewayBaseUri + "/feedback";

  const postFeedback = (data: Feedback) => {
    return fetch(feedbackUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    });
  };

  // service result gebruiken? return ServiceResult.fromPromise(fetchBerichten);

  return {
    postFeedback,
  };
}
