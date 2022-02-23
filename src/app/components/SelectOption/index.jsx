import React, { useState } from 'react';

import { Select as AntSelect } from 'antd';

import './styles.css';

const { AntOption = Option } = AntSelect;

export default function SelectOption({
	options,
	getValueSelected,
	width,
	placeholder,
	defaultValue = '',
	disabled = false
}) {
	const [isArrowUp, setIsArrowUp] = useState(false);

	const handleChange = value => {
		getValueSelected && getValueSelected(value);
		setIsArrowUp(false);
	};

	return (
		<div className='select_option-custom' style={{ width: width }}>
			<AntSelect
				style={{ width: '100%' }}
				onChange={handleChange}
				onFocus={() => setIsArrowUp(true)}
				onBlur={() => setIsArrowUp(false)}
				showSearch
				placeholder={placeholder}
				optionFilterProp='children'
				filterOption={(input, option) =>
					option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				filterSort={(optionA, optionB) =>
					optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
				}
				defaultValue={defaultValue || null}
				disabled={disabled}
			>
				{options &&
					options.map(option => (
						<AntOption key={option.key} value={JSON.stringify(option)} style={{ fontSize: '1rem' }}>
							{option.text}
						</AntOption>
					))}
			</AntSelect>

			<span
				className={`anticon anticon-search ant-select-suffix pos-anticon-search ${
					isArrowUp ? 'animate-anticon-search' : ''
				}`}
			></span>
		</div>
	);
}
