import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { IState } from "../../../hooks/syncStore";
import { useSocket } from "../../../util/promiseSocket";

type InputValues = {
  nickname: string;
};

const schema = z.object({
  nickname: z.string().min(2, { message: "Please enter your nickname" }),
});

type Props = {};

const CreateGame = (props: Props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation(
    async (data: InputValues) => {
      return await useSocket.postMessage("create-game", {
        nickname: data.nickname,
      });
    },
    {
      onSuccess(p) {
        const payload = p as unknown as { data: IState["Game"] };

        navigate(`/game/${payload.data._id}`);
      },
    }
  );

  const onSubmit = async (data: InputValues) => {
    await mutateAsync(data);
    reset();
  };

  return (
    <div className="text-left bg-gray-600">
      <div className="flex min-h-full">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <div className="mt-8">
              <div>
                <div className="relative mt-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="p-3 text-lg text-white rounded-lg bg-zinc-500">
                      Create Game
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <form
                  method="POST"
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-white">
                      Nickname
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("nickname")}
                        style={{
                          border: !errors.nickname ? "" : "2px solid red",
                        }}
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`flex justify-center w-full px-4 py-2 text-sm btn btn-primary ${
                      isLoading && "loading"
                    }`}>
                    Ok
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
