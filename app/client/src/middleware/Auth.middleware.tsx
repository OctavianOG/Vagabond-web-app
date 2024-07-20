import { useCookies } from "react-cookie";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "../store/store";
import { UserInterface } from "../libs/types";
import { trpc } from "../trpc";
import React from "react";

type MiddlewareProps = {
  children: React.ReactElement;
};

const AuthMiddleware: React.FC<MiddlewareProps> = ({ children }) => {
  const [cookies] = useCookies(["logged_in"]);
  const store = useStore();

  const queryClient = useQueryClient();
  const { refetch } = trpc.refreshToken.useQuery(undefined, {
    retry: 1,
    enabled: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries([["getUser"]]);
    },
    onError: (error) => {
      document.location.href = "/login";
    },
  });

  const query = trpc.getUser.useQuery(undefined, {
    retry: 1,
    enabled: !!cookies.logged_in,
    select: (data) => data.data.user,
    onSuccess: (data) => {
      store.setAuthorizedUser(data as unknown as UserInterface);
    },
    onError: (error) => {
      if (error.message.includes("must be logged in")) {
        try {
          refetch({ throwOnError: true });
        } catch (error) {
          if (error.message.includes("Couldn't refresh access token")) {
            document.location.href = "/login";
          }
        }
      }
    },
  });
  if (query.isLoading && cookies.logged_in) {
    console.log("Please wait,loading...");
  }
  return children;
};

export default AuthMiddleware;
