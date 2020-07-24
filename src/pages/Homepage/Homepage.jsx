import React, { useState, useEffect } from 'react';
import { useDataContext } from '../../contexts/data-context';
import { fetchHomepage } from '../../fetchers';
import Notification from '../../components/Notification';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';
import { getPageMetadata } from '../../helpers/metadata';

export default function Homepage() {
    // Get initial data from the data context.
    // Data context wont be populated with data if the page was rendered client-side
    const initialData = useDataContext();

    // Set notification when one is sent down from the server
    const notification = initialData && initialData.notification;

    // Manage page data in local state, setting initial value if has been data sent down from the server
    const [pageData, setPageData] = useState(initialData && initialData.page);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getHomepageData = async () => {
            if (initialData && initialData.page) {
                setPageData(initialData.page);
            } else {
                const data = await fetchHomepage();
                setPageData(data.page);
            }
        };

        getHomepageData();
        // Leave second arg as empty array to only execute on component render (componentDidMount)
    }, []);

    if (!pageData) {
        // Render loading indicator until page data has been fetched
        return (<div>Page loading...</div>);
    }

    return (
        <div className="page">
            {getPageMetadata({
                title: pageData.title,
                description: pageData.metadata.description,
                keywords: pageData.metadata.keywords
            })}
            {notification &&
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
            }
            <PageHeader heading={pageData.title} />
            <PageContent>
                <p>{pageData.content}</p>
            </PageContent>
        </div>
    );
}
