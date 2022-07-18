import type { Feedback } from "./types";
import { ref } from "vue";
import { ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services/wait-for-login";

export function useFeedbackService() {
  if (!window.gatewayBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  const feedbackUrl = window.gatewayBaseUri + "/api/reviews";

  const postFeedback = (data: Feedback) => {
    const promise = fetchLoggedIn(feedbackUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(MapModel(data)),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    });

    const state = ServiceResult.fromPromise(promise);

    const result = { state: state, promise: promise };

    return result;
  };

  return {
    postFeedback,
  };
}

function MapModel(feedbackModel: Feedback) {
  if (!feedbackModel) {
    throw new Error("Missing pramater feedbackModel");
  }
  return {
    topic: feedbackModel.uri,
    name: feedbackModel.naam,
    description: `Content\r\n${feedbackModel.content}\r\n\r\nOpmerking\r\n${feedbackModel.opmerking}\r\n\r\nAanleiding\r\n${feedbackModel.aanleiding}\r\n\r\nContctgegevens\r\n${feedbackModel.contactgegevens}`,
  };
}
