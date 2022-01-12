import React, {useState} from 'react';
import {
	studioTheme,
	ThemeProvider,
	ToastProvider,
	Box,
	Heading,
	Button,
} from '@sanity/ui';
import {AddIcon} from '@sanity/icons';
import DeployList from './DeployList';
import DeployModalNew from './DeployModalNew';

const Deploy = () => {
	const [isNewWebhookModalOpen, setNewWebhookModalOpen] = useState(false);

	const environments = (
		<Box padding={4}>
			<Box marginY={4}>
				<Heading as="h1" size={2}>
					Environments
				</Heading>
			</Box>
			<DeployList />
			<Box marginTop={4}>
				<Button
					icon={AddIcon}
					tone="primary"
					text="New Environment"
					onClick={() => setNewWebhookModalOpen(true)}
				/>
			</Box>
		</Box>
	);

	const newWebhookModal = isNewWebhookModalOpen && (
		<DeployModalNew onClose={() => setNewWebhookModalOpen(false)} />
	);

	return (
		<ThemeProvider theme={studioTheme}>
			<ToastProvider>
				<Box>
					{environments}
					{newWebhookModal}
				</Box>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default Deploy;