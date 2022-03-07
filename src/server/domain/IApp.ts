import { ITest } from "./ITest";

export interface AppStates {
    username?: string;
    textOfPostTest: string,
    textForPost: string,
    textOfPutTest: string,
    textForPut: string,
    textOfDeleteTest: string,
    textForDelete: string,
    response?: ITest,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {
}
