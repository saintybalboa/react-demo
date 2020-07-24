import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from '../../contexts/data-context';
import { fetchService } from '../../fetchers';
import PageHeader from '../../components/PageHeader';
import PageContent from '../../components/PageContent';
import { getPageMetadata } from '../../helpers/metadata';

export default function Service() {
    // Get initial data from the data context.
    // Data context wont be populated with data if the page was rendered client-side
    const initialData = useDataContext();

    // Get service id from URL parameters.
    const { id } = useParams();

    // Manage service data in local state, setting initial value if has been data sent down from the server
    const [serviceData, setServiceData] = useState(initialData && initialData.service);

    useEffect(() => {
        // useEffect() is not an async function, therefore we cannot use 'await'
        // Create an async function to use 'await' and invoke the function within useEffect()
        const getServiceData = async () => {
            // Fetch service data if it does not already exist for the service with the specified id
            if (initialData && initialData.service && initialData.service.id === id) {
                setServiceData(initialData.service);
            } else {
                const serviceData = await fetchService({ id });
                setServiceData(serviceData.service);
            }
        };

        getServiceData();
        // Execute each time the service id changes to fetch & render that service page (componentDidMount & componentDidUpdate)
    }, [id]);

    if (!serviceData) {
        // Render loading indicator until service data has been fetched
        return (<div>Page loading...</div>);
    }

    return (
        <div className="page">
            {getPageMetadata({
                title: serviceData.name,
                description: serviceData.metadata.description,
                keywords: serviceData.metadata.keywords
            })}
            <PageHeader heading={serviceData.name} />
            <PageContent>
                <ul>
                    {serviceData.items.map(value => (
                        // Set key to unique value to allow React identify and manage each instance/sibling of a component/element
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </PageContent>
        </div>
    );
}
