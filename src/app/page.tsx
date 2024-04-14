import React from 'react';
import styles from './page.module.css';
import DynamicForm from '@/components/DynamicForm/DynamicForm'; // Make sure the path is correct
import { forms } from '@/components/DynamicForm/interfaces'; // Assuming FormConfig is exported from interfaces

const forms = [
    {
        name: 'contact',
        title: 'Contact Us',
        selector: 'contactform',
        action: '/ajax/contact',
        fields: [
            {
                name: 'firstname',
                label: 'First Name',
                maxlen: 120,
                required: true,
            },
            {
                name: 'surname',
                label: 'Surname',
                maxlen: 120,
            },
            {
                name: 'email',
                label: 'Email',
                maxlen: 256,
                validate: 'email',
                required: true,
            },
            {
                name: 'type',
                label: 'Enquiry Type',
                input: 'select',
                options: [
                    {
                        label: 'General Enquiry',
                        value: 'general',
                    },
                    {
                        label: 'Support Request',
                        value: 'support',
                    },
                    {
                        label: 'Complaint',
                        value: 'complaint',
                    },
                ],
            },
            {
                name: 'subscribe',
                label: 'Subscribe to newsletters',
                input: 'checkbox',
            },
            {
                name: 'message',
                label: 'Message',
                input: 'textarea',
                required: true,
            },
        ],
    },
    {
        name: 'website-search',
        title: 'Website Search',
        selector: 'searchform',
        action: '/ajax/search',
        submit: 'Search',
        fields: [
            {
                name: 'term',
                label: 'What you looking for',
                maxlen: 256,
                validate: 'email',
                required: true,
            },
            {
                name: 'lucky',
                label: 'Feeling lucky',
                input: 'checkbox',
                value: false,
            },
        ],
    },
];
export default function Home() {
    return (
        <main className={styles.main}>
            {forms.map((form) => (
                <DynamicForm key={form.name} config={form.fields} />
            ))}
        </main>
    );
}
