import { useCallback, useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { RepositoryItem } from "./RepositoryItem";
import toast, { Toaster } from 'react-hot-toast';
import "../style/repositories.scss";
import debounce from 'lodash.debounce';
import SpinnerLoader from "./Spinner";

interface Repository {
    name: string;
    html_url: string;
    id: number;
    stargazers_count: number;
    updated_at: string;
    pushed_at: string;
    description: string;
}

interface Users {
    avatar: string;
    name: string;
    repos: string;
    id: number;
}

export function RepositoryList() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const [userSearchText, setUserSearchText] = useState<string>('');
    const [userSelected, setUserSelected] = useState<Users>();
    const [isComponentVisible, setIsComponentVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const debouncedChangeHandler = useCallback(
        debounce(getUsersByName, 500)
    , []);

    function getReposByUser(user: Users) {
        if (user) {
            setIsLoading(true);
            fetch(user.repos)
                .then((response) => response.json())
                .then((repos) => {
                    const repoResult = repos.map((repo: Repository) => {
                        return {
                            name: repo.name,
                            html_url: repo.html_url,
                            id: repo.id,
                            stargazers_count: repo.stargazers_count,
                            pushed_at: repo.pushed_at,
                            updated_at: repo.updated_at,
                            description: repo.description
                        };
                    });
                    setRepositories(repoResult);
                    setIsLoading(false)
                });
        } else {
            toast.error("Nenhum usuário selecionado!");
        }
    }

    function getUsersByName(name: string) {
        if(name.length === 0) {
            setIsComponentVisible(false);
            return;
        }
        fetch(`https://api.github.com/search/users?q=${name}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    toast.error('Ops! Espere um pouco e digite novamente.');
                    throw new Error(response.statusText);
                } else {
                    toast.error("Ops, algo inesperado ocorreu, tente novamente...");
                    throw new Error(response.statusText);
                }
            })
            .then((responseData) => {
                if (responseData.items.length > 0) {
                    const usersResult = responseData.items.map((item: any) => {
                        return {
                            avatar: item.avatar_url,
                            name: item.login,
                            repos: item.repos_url,
                            id: item.id
                        };
                    });
                    setUsers(usersResult);
                    setIsComponentVisible(true);
                } else {
                    toast.error("Nenhum usuário foi encontrado, tente novamente!");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function selectUser(user: Users) {
        setIsComponentVisible(false);
        setUserSearchText(user.name);
        setUserSelected(user);
        getReposByUser(user);
    }

    return (
        <>
            <header className="header">
                <h1>
                    Github Explorer <GoMarkGithub />
                </h1>
                <h4>Pesquise por repositórios de usuários do Github.</h4>
            </header>

            <main>
                <section className="userSearch">
                    <div className="userInput">
                        <input
                            type="search"
                            name="search"
                            placeholder="Qual usuário você está procurando?"
                            required
                            value={userSearchText}
                            autoComplete="false"
                            onChange={(event) => {
                                setUserSearchText(event.target.value);
                                debouncedChangeHandler(event.target.value);
                            }}
                        />
                    </div>
                    {users.length > 0 && isComponentVisible && (
                        <ul className="autoCompleteContainer">
                            {users.map((user: Users) => (
                                <li className="autoCompleteItem" key={user.id} 
                                    onClick={() => selectUser(user)}>
                                    <button
                                        key={user.id}
                                        className="autoCompleteItemButton"
                                    >
                                        {user.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                
                { isLoading && <SpinnerLoader />}

                {(userSelected && !isLoading) && (
                    <section className="repoSearch">
                        <div className="listUsers">
                            <ul>
                                {repositories.map((repo) => {
                                    return (
                                        <RepositoryItem
                                            key={repo.id}
                                            repository={repo}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                )}

                { (userSelected && !isLoading && repositories.length === 0) && (
                    <div className="noRepositories">
                        <h1>Nenhum repositório para este usuário.</h1>
                    </div>
                )}
            </main>
            <footer>
                Feito por{" "}
                <a href="https://github.com/brunanunesbarros" target="_blank">
                    Bruna Barros
                </a>{" "}
                ✨
            </footer>
            <Toaster position="top-right" />
        </>
    );
}
