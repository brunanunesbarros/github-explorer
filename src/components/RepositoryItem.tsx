import { AiFillStar, AiOutlineCalendar } from "react-icons/ai";
import { BsFillCalendarPlusFill, BsCalendarCheckFill } from "react-icons/bs";
import formatDate from "../util/format";

interface RepositoryItemProps {
    repository: {
        name: string;
        html_url: string;
        id: number;
        stargazers_count: number;
        updated_at: string;
        pushed_at: string;
        description: string;
    };
}

export function RepositoryItem(props: RepositoryItemProps) {
    return (
        <li>
            <strong>{props.repository.name}</strong>
            {props.repository.description ? (
                <p>{props.repository.description}</p>
            ) : (
                <p>Este repositório não possui descrição!</p>
            )}

            <div>
                <p>
                    <AiFillStar
                        style={{ color: "yellow" }}
                        size="20"
                    />
                    {props.repository.stargazers_count}
                </p>
                <p>
                    <AiOutlineCalendar size="20" />
                    {formatDate(props.repository.pushed_at)} 
                </p>
            </div>

            <a href={props.repository.html_url} target="_blank">
                Acessar Repositório
            </a>
        </li>
    );
}
