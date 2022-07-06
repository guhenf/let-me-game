import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { UserContext } from "../../../providers/user";
import { internalApi } from "../../../services/internalAPI";
import { Div } from "./style";

export const DivForm = () => {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  const formSchema = yup.object().shape({
    email: yup.string().required("Email obrigatório").email("Email inválido"),
    password: yup.string().required("Senha obrigatória"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const onSubmit = (data) => {
    const request = internalApi.post("login", data);
    toast.promise(request, {
      loading: "Carregando",
      success: (data) => {
        localStorage.setItem("@tokenLMG", data.data.accessToken);
        setUser(data.data.user);
        history.push("/home");
      },
      error: (err) => "Usuário ou senha incorretos",
    });
  };

  return (
    <Div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>LOGIN</h1>
        <div className="div__inputs">
          <div className="div__input">
            <div className="label">
              <span>Email</span>
              {errors && <h6>{errors.email?.message}</h6>}
            </div>
            <input placeholder="Seu email" {...register("email")} />
          </div>
          <div className="div__input">
            <div className="label">
              <span>Senha</span>
              {errors && <h6>{errors.password?.message}</h6>}
            </div>
            <input
              type="password"
              placeholder="Sua Senha"
              {...register("password")}
            />
          </div>
        </div>
        <div className="link__register">
          <p>Ainda não tem uma conta?</p>
          <p>
            Cadastre-se <Link to="/register">aqui</Link>!
          </p>
        </div>
        <button type="submit">Login</button>
      </form>
      <Toaster />
    </Div>
  );
};