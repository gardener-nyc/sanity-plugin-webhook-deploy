import React, {useState} from 'react';
import {nanoid} from 'nanoid';
import client from 'part:@sanity/base/client';
import styled from 'styled-components';
import {useToast, Box, Card, Button, Spinner, Dialog} from '@sanity/ui';
import axios from 'axios';

const DeployItem = ({hook}) => {
	const toast = useToast();
	const [lastDeploy, setLastDeploy] = useState(nanoid());
	const [isDeleting, setIsDeleting] = useState(false);
	const [isConfirmOpen, setConfirmOpen] = useState(false);

	const onDelete = async () => {
		setIsDeleting(true);

		try {
			await client.delete(hook._id);
		} catch (error) {
			toast.push({
				status: 'error',
				title: 'An error occured in deleting this webhook.',
			});
		}

		setIsDeleting(false);

		toast.push({
			status: 'success',
			title: `Deleted ${hook.title}!`,
		});

		setConfirmOpen(false);
	};

	const onDeploy = async () => {
		try {
			await axios.post(hook.url, {});
		} catch (error) {
			toast.push({
				status: 'error',
				title: 'An error occured in deploying this webhook.',
			});
		}

		setLastDeploy(nanoid());

		toast.push({
			status: 'success',
			title: `Deployed ${hook.title}!`,
		});
	};

	const confirmDialog = isConfirmOpen && (
		<Dialog
			width={1}
			header={`Delete ${hook.title}`}
			onClose={() => setConfirmOpen(false)}>
			<Box padding={4} paddingTop={0}>
				<Box marginBottom={4}>
					<p>
						This deletes your deploy button, but will not delete the
						environment. This is a permanent action. You'll need to
						re-add this environment.
					</p>
				</Box>
				{isDeleting ? (
					<Spinner />
				) : (
					<Button
						tone="critical"
						text="Permanently Delete"
						onClick={onDelete}
					/>
				)}
			</Box>
		</Dialog>
	);

	const CardRow = styled.div`
		display: flex;
		flex-direction: column;

		@media (min-width: 1000px) {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	`;

	const MetaContainer = styled.div`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 20px;

		@media (min-width: 1000px) {
			flex-direction: row;
			margin-bottom: 0;
		}
	`;

	const MetaColumn = styled.div`
		margin-bottom: 5px;

		@media (min-width: 1000px) {
			margin-bottom: 0;
			margin-right: 10px;
		}
	`;

	const ActionsContainer = styled.div`
		display: flex;
		flex-direction: row;
		align-items: flex-start;

		@media (min-width: 1000px) {
			align-items: flex-end;
		}
	`;

	const Code = styled.div`
		font-family: -apple-system-ui-monospace, 'SF Mono', Menlo, Monaco,
			Consolas, monospace;
		padding: 2px;
		display: block;
		font-size: 0.75em;
		overflow-wrap: break-word;
		border-radius: 5px;
		border: 1px solid #cdcdcd;
		@media (max-width: 600px) {
			max-width: 250px;
		}
	`;

	return (
		<Card padding={4} radius={2} shadow={1}>
			<CardRow>
				<MetaContainer>
					<MetaColumn>
						<p style={{margin: 0}}>{hook.title || 'Netlify'}</p>
					</MetaColumn>
					<MetaColumn>
						<Code size={1}>{hook.url}</Code>
					</MetaColumn>
					<img
						key={lastDeploy}
						src={hook.statusBadgeUrl}
						style={{display: 'block'}}
					/>
				</MetaContainer>
				<ActionsContainer>
					<Box>
						<Button
							tone="critical"
							text="Delete"
							onClick={() => setConfirmOpen(true)}
						/>
					</Box>
					<Box marginLeft={2}>
						<Button
							tone="primary"
							text="Start Deploy"
							onClick={onDeploy}
						/>
					</Box>
				</ActionsContainer>
			</CardRow>
			{confirmDialog}
		</Card>
	);
};

export default DeployItem;
