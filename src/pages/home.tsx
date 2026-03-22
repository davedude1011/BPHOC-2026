import { For } from "solid-js";
import { Text } from "../components/content";
import { Header, MutedHeader, SubHeader } from "../components/headers";
import { Break, Divider, PageContainer, PathButton } from "../components/page-utils";

export default function Home() {
    const paper_data = [
        {
            title:    "Random walk",
            subtitle: "simulating uniformly random space traversal",
            href:     "/task-1",
        },
        {
            title:    "Brownian Motion",
            subtitle: "modeling particle interactions in a closed system",
            href:     "/task-2",
        },
    ]

    return (
        <PageContainer>
            <MutedHeader>
                <span>BRITISH PHYSICS OLYMPIAD</span>
                <span>COMPUTATIONAL CHALLENGE</span>
                <span>2026</span>
            </MutedHeader>

            <Break />

            <Header>
                2026 Challenge Submission
            </Header>
            <SubHeader>
                Quantum Mechanics
            </SubHeader>

            <Break />

            <Text>
                An interactive submission & research paper, containing my processes, research, and live simulations for each of the tasks,
                written in solid-js, using a rust wasm binding for realtime computation.
            </Text>

            <Break />

            <Divider />

            <Break count={2} />

            <MutedHeader>
                PAPERS
            </MutedHeader>

            <For each={paper_data}>
                {(paper, index) => (
                    <>
                        <PathButton index={index() + 1} {...paper} />
                        {index() < paper_data.length - 1 && <Divider />}
                    </>
                )}
            </For>
        </PageContainer>
    )
}