import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UserInterface } from "../libs/types";
import { useCookies } from "react-cookie";
import useStore from "../store/store";
import { trpc } from "../trpc";
import { Roles } from "server/src/model/user.model";

const UserRequire = ({ allowedRoles }: { allowedRoles: Roles }) => {
  const [cookies] = useCookies(["logged_in"]);
  const location = useLocation();
  const store = useStore();

  trpc.getUser.useQuery(undefined, {
    retry: 1,
    select: (data) => data.data.user,
    onSuccess: (data) => {
      store.setAuthorizedUser(data as unknown as UserInterface);
    },
    onError: (error) => {
      let requestRetry = true;
      if (error.message.includes("must be logged in") && requestRetry) {
        requestRetry = false;
        try {
          /* empty */
        } catch (error) {
          console.error;
          if (error.message.includes("Could not refresh access token")) {
            document.location.href = "/login";
          }
        }
      }
    },
  });

  const user = store.authorizedUser;

  return (cookies.logged_in || user) &&
    allowedRoles.includes(user?.role as string) ? (
    <Outlet />
  ) : cookies.logged_in && user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default UserRequire;
