import { CourseType, courseService } from "@/src/services/courseService";
import styles from "../styles/search.module.scss";
import HeaderAuth from "@/src/components/common/headerAuth"
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import SearchCard from "@/src/components/searchCard";
import Footer from "@/src/components/common/footer";
import PageSpinner from "@/src/components/common/spinner";

const Search = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState<CourseType[]>([]);

    useEffect(() => {
        if (!sessionStorage.getItem("onebitflix-token")) {
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <PageSpinner />;
    }

    const searchName: any = router.query.name;

    const searchCourses = async () => {
        const res = await courseService.getSearch(searchName);

        setSearchResult(res.data.courses);
    };

    useEffect(() => {
        searchCourses();
    }, [searchName]);

    return (
        <>
            <Head>
                <title>OneBitFlix: {searchName}</title>
                <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
            </Head>
            <main className={styles.main}>
                <div className={styles.header}>
                    <HeaderAuth />
                </div>
                {searchResult.length >= 1 ? (
                    <div className={styles.searchContainer}>
                        <Container className="d-flex justify-content-center flex-wrap gap-5 py-4">
                            {searchResult?.map((course) => (
                                <SearchCard key={course.id} course={course} />
                            ))}
                        </Container>
                    </div>
                ) : (
                    <div className={styles.searchContainer}>
                        <p className={styles.noSearchResult}>Nenhum resultado encontrado</p>
                    </div>
                )}
                <div className={styles.footer}>
                    <Footer />
                </div>
            </main>
        </>
    );
};

export default Search;
