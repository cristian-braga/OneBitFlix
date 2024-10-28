import Head from "next/head";
import styles from "../../../styles/episodePlayer.module.scss";
import { useRouter } from "next/router";
import HeaderGeneric from "@/src/components/common/headerGeneric";
import { useEffect, useRef, useState } from "react";
import { CourseType, courseService } from "@/src/services/courseService";
import PageSpinner from "@/src/components/common/spinner";
import { Button, Container } from "reactstrap";
import ReactPlayer from "react-player";
import watchEpisodeService from "@/src/services/episodeService";

const EpisodePlayer = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseType>();
    const [getEpisodeTime, setGetEpisodeTime] = useState<number | null>(0);
    const [episodeTime, setEpisodeTime] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem("onebitflix-token")) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    const episodeOrder = parseFloat(router.query.id?.toString() || "");
    const courseId = router.query.courseid?.toString() || "";
    const episodeId = parseFloat(router.query.episodeid?.toString() || "");

    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        const handleGetEpisodeTime = async () => {
            const res = await watchEpisodeService.getWatchTime(episodeId);
            if (res.data !== null) {
                setGetEpisodeTime(res.data.seconds);
            }
        };

        handleGetEpisodeTime();
    }, [episodeId]);

    const handleSetEpisodeTime = async () => {
        await watchEpisodeService.setWatchTime({
            episodeId,
            seconds: Math.round(episodeTime)
        });
    };

    const handlePlayerTime = () => {
        if (getEpisodeTime) {
            playerRef.current?.seekTo(getEpisodeTime);
        }

        setIsReady(true);
    };

    if (isReady) {
        setTimeout(() => {
            handleSetEpisodeTime();
        }, 1000 * 3);
    }

    const handleLastEpisode = () => {
        router.push(`/course/episode/${episodeOrder - 1}?courseid=${course?.id}&episodeid=${episodeId - 1}`);
    };

    const handleNextEpisode = () => {
        router.push(`/course/episode/${episodeOrder + 1}?courseid=${course?.id}&episodeid=${episodeId + 1}`);
    };

    useEffect(() => {
        const getCourse = async () => {
            if (typeof courseId !== "string") return;
    
            const res = await courseService.getEpisodes(courseId);
    
            if (res.status === 200) {
                setCourse(res.data);
            }
        };
        getCourse();
    }, [courseId]);

    if (!course?.episodes || loading) return <PageSpinner />;

    if (episodeOrder + 1 < course?.episodes?.length) {
        if (Math.round(episodeTime) === course.episodes[episodeOrder].secondsLong) {
            handleNextEpisode();
        }
    }

    return (
        <>
            <Head>
                <title>OneBitFlix: {course.episodes[episodeOrder].name}</title>
                <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
            </Head>
            <main>
                <HeaderGeneric logoUrl="/home" btnContent={"Voltar para o curso"} btnUrl={`/course/${courseId}`} />
                <Container className="d-flex flex-column align-items-center gap-3 pt-5">
                    <p className={styles.episodeTitle}>
                        {course.episodes[episodeOrder].name}
                    </p>
                    {typeof window === undefined ? null : (
                        <ReactPlayer
                            className={styles.player}
                            url={`${process.env.NEXT_PUBLIC_BASEURL}/episodes/stream?videoUrl=${course.episodes[episodeOrder].videoUrl}&token=${sessionStorage.getItem("onebitflix-token")}`}
                            controls
                            ref={playerRef}
                            onStart={handlePlayerTime}
                            onProgress={(progress) => { setEpisodeTime(progress.playedSeconds); }}
                        />
                    )}
                    <div className={styles.episodeButtonDiv}>
                        <Button className={styles.episodeButton} disabled={episodeOrder === 0 ? true : false} onClick={handleLastEpisode}>
                            <img src="/episode/iconArrowLeft.svg" alt="setaEsquerda" className={styles.arrowImg} />
                        </Button>
                        <Button className={styles.episodeButton} disabled={episodeOrder + 1 === course.episodes.length ? true : false} onClick={handleNextEpisode}>
                            <img src="/episode/iconArrowRight.svg" alt="setaDireita" className={styles.arrowImg} />
                        </Button>
                    </div>
                    <p className="text-center py-4">
                        {course.episodes[episodeOrder].synopsis}
                    </p>
                </Container>
            </main>
        </>
    );
};

export default EpisodePlayer;
