import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { Col, Input, Row } from 'antd';
import { SyncOutlined } from '@ant-design/icons/lib/icons';

import { declarationTypes } from 'app/services';

import Footer from 'app/components/Footer';
import SelectOption from 'app/components/SelectOption';
import DatePickerCustom from 'app/components/DatePickerCustom';

import './styles.css';

export default function DeclarationForm() {
	const { TextArea } = Input;

	const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
	const [epidemiologicalFactors, setEpidemiologicalFactors] = useState([]);
	const [nations, setNations] = useState([]);
	const [provinces, setProvinces] = useState([]);
	const [provinceSelected, setProvinceSelected] = useState(null);
	const [districts, setDistricts] = useState([]);
	const [districtSelected, setDistrictSelected] = useState(null);
	const [wards, setWards] = useState([]);
	const [declarationPlaces, setDeclarationPlaces] = useState([]);
	const [captchaText, setCaptchaText] = useState(null);
	const [declarationTypesState, setDeclarationTypesState] = useState(() => declarationTypes || []);
	const [displayType, setDisplayType] = useState(undefined);
	const [typeOfTestObject, setTypeOfTestObject] = useState('no');
	const [backgroundDisease, setBackgroundDisease] = useState('no');
	const [isUsedMolnupiravir, setIsUsedMolnupiravir] = useState('no');
	const codeRef = useRef();

	const [diaChi, setDiaChi] = useState(null);
	const [gioiTinh, setGioiTinh] = useState('Nam');
	const [khoaPhong, setKhoaPhong] = useState(null);
	const [maBenhNhan, setMaBenhNhan] = useState(null);
	const [maSinhVien, setMaSinhVien] = useState(null);
	const [namSinh, setNamSinh] = useState(null);
	// const [ngaySinh, setNgaySinh] = useState(null);
	const [noiTru, setNoiTru] = useState(0);
	// const [quanHuyen, setQuanHuyen] = useState({}); // disStrict
	const [quocTichID, setQuocTichID] = useState(null);
	const [soDienThoai, setSoDienThoai] = useState(null);
	const [ten, setTen] = useState(null);
	// const [tinhThanh, setTinh] = useState({}); // province
	const [xaPhuong, setXaPhuong] = useState({});

	useEffect(() => {
		const diseaseSymptomsUrl = `https://kbyt.khambenh.gov.vn/api/v1/trieuchung?q={%22filters%22:{%22$and%22:[{%22trangthai%22:{%22$eq%22:1}}]},%22order_by%22:[{%22field%22:%22thutu_uutien%22,%22direction%22:%22asc%22}]}`;
		const epidemiologicalFactorsUrl = `https://kbyt.khambenh.gov.vn/api/v1/dichte?q={%22filters%22:{%22$and%22:[{%22trangthai%22:{%22$eq%22:1}}]},%22order_by%22:[{%22field%22:%22thutu_uutien%22,%22direction%22:%22asc%22}]}`;
		const nationUrl = `https://kbyt.khambenh.gov.vn/api/v1/quocgia?results_per_page=1000&q={%22filters%22:{%22$and%22:[{%22deleted%22:{%22$eq%22:false}},{%22active%22:{%22$eq%22:1}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;
		const provincesUrl = `https://kbyt.khambenh.gov.vn/api/v1/tinhthanh?results_per_page=100&q={%22filters%22:{%22$and%22:[{%22deleted%22:{%22$eq%22:false}},{%22active%22:{%22$eq%22:1}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;

		axios.get(diseaseSymptomsUrl).then(resp => setDiseaseSymptoms(resp.data?.objects || []));
		axios
			.get(epidemiologicalFactorsUrl)
			.then(resp => setEpidemiologicalFactors(resp.data?.objects || []));
		axios.get(nationUrl).then(resp => {
			const data = resp.data?.objects.map(nation => ({
				id: nation.id,
				key: nation.id,
				value: nation.ten,
				text: nation.ten
			}));
			setNations(data);
		});
		axios.get(provincesUrl).then(resp => {
			const data = resp.data?.objects.map(province => ({
				id: province.id,
				key: province.id,
				value: province.ten,
				text: province.ten
			}));
			setProvinces(data);
		});
	}, []);

	useEffect(() => {
		if (provinceSelected !== null) {
			const provinceId = JSON.parse(provinceSelected)?.id;

			const districtsUrl = `https://kbyt.khambenh.gov.vn/api/v1/quanhuyen?results_per_page=30&q={%22filters%22:{%22$and%22:[{%22deleted%22:{%22$eq%22:false}},{%22active%22:{%22$eq%22:1}},{%22tinhthanh_id%22:{%22$eq%22:%22${provinceId}%22}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;
			axios.get(districtsUrl).then(resp => {
				const data = resp.data?.objects.map(district => ({
					id: district.id,
					key: district.id,
					value: district.ten,
					text: district.ten
				}));
				setDistricts(data);
			});
		}
	}, [provinceSelected]);

	useEffect(() => {
		if (districtSelected !== null) {
			const districtId = JSON.parse(districtSelected)?.id;
			const wardsUrl = `https://kbyt.khambenh.gov.vn/api/v1/xaphuong?results_per_page=50&q={%22filters%22:{%22$and%22:[{%22deleted%22:{%22$eq%22:false}},{%22active%22:{%22$eq%22:1}},{%22quanhuyen_id%22:{%22$eq%22:%22${districtId}%22}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;
			axios.get(wardsUrl).then(resp => {
				const data = resp.data?.objects.map(ward => ({
					id: ward.id,
					key: ward.id,
					value: ward.ten,
					text: ward.ten
				}));
				setWards(data);
			});
		}
	}, [districtSelected]);

	useEffect(() => {
		if (displayType === declarationTypes[3].value) {
			const declarationPlacesUrl = `https://kbyt.khambenh.gov.vn/api/v1/donvi_filter?page=1&results_per_page=25&q={%22filters%22:{%22$and%22:[{%22tuyendonvi_id%22:{%22$neq%22:%227%22}},{%22active%22:{%22$eq%22:true}},{%22tiemchung_vacxin%22:{%22$eq%22:true}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;

			axios.get(declarationPlacesUrl).then(resp => {
				const data = resp.data?.objects.map(province => ({
					id: province.id,
					key: province.id,
					value: province.ten,
					text: province.ten
				}));
				setDeclarationPlaces(data);
			});
		} else {
			const declarationPlacesUrl = `https://kbyt.khambenh.gov.vn/api/v1/donvi_filter?page=1&results_per_page=25&q={%22filters%22:{%22$and%22:[{%22tuyendonvi_id%22:{%22$neq%22:%227%22}},{%22active%22:{%22$eq%22:true}}]},%22order_by%22:[{%22field%22:%22ten%22,%22direction%22:%22asc%22}]}`;

			axios.get(declarationPlacesUrl).then(resp => {
				const data = resp.data?.objects.map(province => ({
					id: province.id,
					key: province.id,
					value: province.ten,
					text: province.ten
				}));
				setDeclarationPlaces(data);
			});
		}
	}, [displayType]);

	const onDeclarationTypeChange = event => {
		const targetValue = event.target.value;
		setDeclarationTypesState(() => {
			return declarationTypes.map(dt => {
				if (targetValue !== dt.value) {
					return { ...dt, checked: false };
				}

				setDisplayType(dt.value);
				return { ...dt, checked: true };
			});
		});
	};

	const handleDeclarationFormSubmit = event => {
		event.preventDefault();
		const saveValue = {
			diaChi: diaChi,
			gioiTinh: gioiTinh,
			khoaPhong: khoaPhong,
			maBenhNhan: maBenhNhan,
			maSinhVien: maSinhVien,
			namSinh: namSinh,
			noiTru: noiTru,
			quanHuyen: JSON.parse(districtSelected),
			quocTichID: quocTichID,
			soDienThoai: soDienThoai,
			ten: ten,
			tinhThanh: JSON.parse(provinceSelected),
			xaPhuong: JSON.parse(xaPhuong)
		};

		console.log(saveValue);
	};

	/**
	 * * dia_chi: "Kiểm tra ứng dụng"
	 * * gioi_tinh: 1
	 * * khoa_phong: null
	 * * ma_benh_nhan: null
	 * * ma_sinh_vien: "090989889"
	 * * namsinh: 2001
	 * * ngaysinh: 987786000
	 * * noi_tru: 0
	 * * quanhuyen:
	 *    id: "76798f84-855d-46d6-b4a5-18b4576545e6"
	 *    ma: "560"
	 *    ten: "Huyện Sơn Hòa"
	 *    tinhthanh_id: "a76fadc8-3f54-4348-ad8b-27750750ac2f"
	 * * quanhuyen_id: "76798f84-855d-46d6-b4a5-18b4576545e6"
	 * * quoctich_id: "ada8ecb6-9089-459d-a403-53125fa6e51c"
	 * * so_dien_thoai: "0333123456"
	 * * ten: "Lê Anh vũ"
	 * * tinhthanh:
	 *     id: "a76fadc8-3f54-4348-ad8b-27750750ac2f"
	 *     ma: "54"
	 *     quocgia_id: "ada8ecb6-9089-459d-a403-53125fa6e51c"
	 *     ten: "Tỉnh Phú Yên"
	 * * tinhthanh_id: "a76fadc8-3f54-4348-ad8b-27750750ac2f"
	 * * xaphuong:
	 *     id: "ec455a39-d931-4ec8-ba5b-19c4adefc4b6"
	 *     ma: "22189"
	 *     quanhuyen_id: "76798f84-855d-46d6-b4a5-18b4576545e6"
	 *     ten: "Xã Sơn Nguyên"
	 * * xaphuong_id: "ec455a39-d931-4ec8-ba5b-19c4adefc4b6"
	 */
	return (
		<div id='declaration-form'>
			<h2 className='title-blue'>SỞ Y TẾ TP. HỒ CHÍ MINH</h2>
			<h3 className='title-red'>
				KHAI BÁO THÔNG TIN SAI LÀ VI PHẠM PHÁP LUẬT VIỆT NAM VÀ CÓ THỂ XỬ LÝ HÌNH SỰ
			</h3>

			<form id='form-container' onSubmit={handleDeclarationFormSubmit}>
				<div className='list-types-declaration'>
					<div className='list-types-declaration-list-radios'>
						{declarationTypesState.map(declarationType => {
							return (
								<label key={declarationType?.id}>
									<input
										type='radio'
										name='declaration-type'
										defaultValue={declarationType?.value || ''}
										onChange={onDeclarationTypeChange}
										checked={declarationType?.checked ?? false}
									/>
									<span className='declaration-type-bold'>{declarationType.text}</span>
								</label>
							);
						})}
					</div>

					<div className='btn-reset-data-wrapper'>
						<button type='reset' className='btn-reset-data'>
							<SyncOutlined />
							Nhập lại
						</button>
					</div>
				</div>
				<div>
					<label>
						<span>
							Nơi khai báo <span className='label-red'> (*)</span>:
						</span>
						<SelectOption
							width={'100%'}
							placeholder={'Nhập và chọn nơi khai báo'}
							options={declarationPlaces}
						/>
					</label>
				</div>

				<div>
					<label>
						<span>
							Số điện thoại <span className='label-red'> (*)</span>:
						</span>
						<Input
							type='number'
							value={soDienThoai}
							onChange={({ target }) => setSoDienThoai(target.value)}
						/>
					</label>
				</div>

				<label>
					<span>
						Họ và tên <span className='label-red'> (*)</span>:
					</span>
					<Input
						type='text'
						placeholder='Họ và tên'
						value={ten}
						onChange={({ target }) => setTen(target.value)}
					/>
				</label>
				<Row gutter={16}>
					<Col className='gutter-row' span={12}>
						<label>
							<span>
								Ngày sinh <span className='label-red'> (*)</span>:
							</span>
							<DatePickerCustom getValueSelected={setNamSinh} />
						</label>
					</Col>

					<Col className='gutter-row' span={12}>
						<label>
							<span>
								Giới tính <span className='label-red'> (*)</span>:
							</span>
							<Input
								type='text'
								value={gioiTinh}
								onChange={({ target }) => setGioiTinh(target.value)}
							/>
						</label>
					</Col>
				</Row>

				{/* display if type is 'Nhân viên bệnh viện' */}
				{displayType && displayType === declarationTypes[1].value ? (
					<>
						<label>
							<span>Mã nhân viên:</span>
							<Input
								type='number'
								placeholder='Mã nhân viên'
								value={maBenhNhan}
								onChange={({ target }) => setMaBenhNhan(target.value)}
							/>
						</label>

						<label>
							<span>Khoa/phòng:</span>
							<Input
								type='text'
								placeholder='Khoa/phòng'
								value={khoaPhong}
								onChange={({ target }) => setKhoaPhong(target.value)}
							/>
						</label>
					</>
				) : null}

				<Row gutter={16}>
					<Col
						className='gutter-row'
						xl={{ span: 6 }}
						lg={{ span: 6 }}
						md={{ span: 12 }}
						xs={{ span: 24 }}
					>
						<label>
							<span>
								Quốc tịch <span className='label-red'> (*)</span>:
							</span>
							<SelectOption
								width={'100'}
								options={nations}
								defaultValue={'Việt Nam'}
								getValueSelected={setQuocTichID}
							/>
						</label>
					</Col>
					<Col
						className='gutter-row'
						xl={{ span: 6 }}
						lg={{ span: 6 }}
						md={{ span: 12 }}
						xs={{ span: 24 }}
					>
						<label>
							<span>
								Tỉnh thành <span className='label-red'> (*)</span>:
							</span>
							<SelectOption
								placeholder={'Tỉnh thành'}
								width={'100'}
								options={provinces}
								getValueSelected={setProvinceSelected}
							/>
						</label>
					</Col>
					<Col
						className='gutter-row'
						xl={{ span: 6 }}
						lg={{ span: 6 }}
						md={{ span: 12 }}
						xs={{ span: 24 }}
					>
						<label>
							<span>
								Quận huyện <span className='label-red'> (*)</span>:
							</span>
							<SelectOption
								disabled={provinceSelected !== null ? false : true}
								placeholder={'Quận huyện'}
								width={'100'}
								options={districts}
								getValueSelected={setDistrictSelected}
							/>
						</label>
					</Col>
					<Col
						className='gutter-row'
						xl={{ span: 6 }}
						lg={{ span: 6 }}
						md={{ span: 12 }}
						xs={{ span: 24 }}
					>
						<label>
							<span>
								Xã phường <span className='label-red'> (*)</span>:
							</span>
							<SelectOption
								disabled={districtSelected !== null ? false : true}
								placeholder={'Xã phường'}
								width={'100'}
								options={wards}
								getValueSelected={setXaPhuong}
							/>
						</label>
					</Col>
				</Row>

				<label>
					<span>
						Số nhà, tên đường <span className='label-red'> (*)</span>:
					</span>
					<Input
						type='text'
						placeholder='Số nhà, tên đường'
						value={diaChi}
						onChange={({ target }) => setDiaChi(target.value)}
					/>
				</label>

				{/* display if type is 'Tiêm chủng vắc xin' hoặc 'Xét nghiệm Covid-19 */}
				{displayType &&
				(displayType === declarationTypes[3].value || displayType === declarationTypes[4].value) ? (
					<label>
						<span>
							CMND/CCCD
							{displayType === declarationTypes[4].value ? (
								<span className='label-red'> (*)</span>
							) : null}
							:
						</span>
						<Input
							type='text'
							placeholder='Nhập chính xác CMND/CCCD'
							value={maSinhVien}
							onChange={({ target }) => setMaSinhVien(target.value)}
						/>
					</label>
				) : null}
				{/* display if type is 'Xét nghiệm Covid-19' */}
				{displayType &&
				(displayType === declarationTypes[4].value || displayType === declarationTypes[5].value) ? (
					<>
						<p className='type-of-test-object-title'>
							Ông/Bà hiện có mắc Covid-19 hoặc các trường hợp theo dõi sau đây không?:
						</p>
						<div className='type-of-test-object'>
							<label>
								<input
									type='radio'
									name='type-of-test-object'
									onChange={() => setTypeOfTestObject('no')}
								/>
								<span>Không</span>
							</label>

							<label>
								<input
									type='radio'
									name='type-of-test-object'
									onChange={() => setTypeOfTestObject('yes')}
								/>
								<span>Có</span>
							</label>

							<label>
								<input
									type='radio'
									name='type-of-test-object'
									onChange={() => setTypeOfTestObject('F1')}
								/>
								<span>F1</span>
							</label>
						</div>
					</>
				) : null}

				{typeOfTestObject === 'yes' ? (
					<>
						<p className='place-of-test-object-title'>Nơi xét nghiệm:</p>
						<div className='place-of-test-object'>
							<label>
								<input type='radio' name='place-of-test-object' />
								<span>Bệnh viện</span>
							</label>
							<label>
								<input type='radio' name='place-of-test-object' />
								<span>Phòng khám tư nhâm</span>
							</label>
							<label>
								<input type='radio' name='place-of-test-object' />
								<span>Khu phong tỏa</span>
							</label>
							<label>
								<input type='radio' name='place-of-test-object' />
								<span>Tự làm xét nghiệm tại nhà</span>
							</label>
						</div>
					</>
				) : null}

				{displayType && displayType === declarationTypes[5].value ? (
					<>
						<p className='background-disease-title'>Ông/Bà có mắc bệnh nền hay không?:</p>
						<div className='background-disease'>
							<label>
								<input
									type='radio'
									name='background-disease'
									onChange={() => setBackgroundDisease('no')}
								/>
								<span>Không</span>
							</label>

							<label>
								<input
									type='radio'
									name='background-disease'
									onChange={() => setBackgroundDisease('yes')}
								/>
								<span>Có</span>
							</label>
						</div>
					</>
				) : null}
				{backgroundDisease && backgroundDisease === 'yes' ? (
					<>
						<p className='type-of-background-disease-title'>Chọn bệnh nền: </p>
						<div className='type-of-background-disease'>
							<label>
								<input type='checkbox' />
								<span>Thận mạn tính</span>
							</label>
							<label>
								<input type='checkbox' />
								<span>Tăng huyết áp</span>
							</label>
							<label>
								<input type='checkbox' />
								<span>Đái tháo đường</span>
							</label>
							<label>
								<input type='checkbox' />
								<span>Bệnh phổi tắc nghẽn mạn tính</span>
							</label>
							<label>
								<input type='checkbox' />
								<span>Có tình trạng béo phì</span>
							</label>
						</div>
					</>
				) : null}

				{displayType && displayType === declarationTypes[5].value ? (
					<>
						<p className='is-used-molnupiravir-title'>Ông/Bà có sử dụng thuốc Molnupiravir?:</p>
						<div className='is-used-molnupiravir'>
							<label>
								<input
									type='radio'
									name='is-used-molnupiravir'
									onChange={() => setIsUsedMolnupiravir('no')}
								/>
								<span>Không</span>
							</label>

							<label>
								<input
									type='radio'
									name='is-used-molnupiravir'
									onChange={() => setIsUsedMolnupiravir('yes')}
								/>
								<span>Có</span>
							</label>
						</div>
					</>
				) : null}

				{isUsedMolnupiravir && isUsedMolnupiravir === 'yes' ? (
					<div className='used-molnupiravir'>
						<div className='used-molnupiravir-title'>
							Ông/bà có triệu chứng nào hay dấu hiệu sau khi sử dụng thuốc Molnupiravir?
							<span className='label-red'> (*)</span>:
						</div>
						<div className='list-symptom-after-used-molnupiravir'>
							{[
								'Không',
								'Nôn',
								'Chóng mặt',
								'Đau bụng',
								'Đau tay chân',
								'Buồn nôn',
								'Tê tay chân',
								'Nổi sần ngứa',
								'Đau đầu',
								'Đau lưng',
								'Sổ mũi',
								'Tiêu chảy',
								'Yếu liệt tay chân',
								'Triệu chứng khác'
							].map((item, index, oldArray) => {
								if (oldArray.length - 1 === index) {
									return (
										<label>
											<span>Triệu chứng khác:</span>
											<Input type='text' />
										</label>
									);
								} else {
									return (
										<label>
											<input type='checkbox' value={item} />
											<span>{item}</span>
										</label>
									);
								}
							})}
						</div>
					</div>
				) : null}
				<div className='disease-symptoms'>
					<div className='disease-symptoms-title'>
						Ông/bà hiện có những triệu chứng hay biểu hiện nào sau đây không?
						<span className='label-red'> (*)</span>:
					</div>
					<table className='disease-symptoms-table'>
						<thead>
							<tr>
								<th>Dấu hiệu</th>
								<th>Có</th>
								<th>Không</th>
							</tr>
						</thead>
						<tbody>
							{diseaseSymptoms.map(diseaseSymptom => (
								<tr key={diseaseSymptom.id}>
									<td>
										{diseaseSymptom.ten}
										<span className='label-red'> (*)</span>
									</td>
									<td>
										<input type='radio' name={diseaseSymptom.id} />
									</td>
									<td>
										<input type='radio' name={diseaseSymptom.id} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='epidemiological-factors'>
					<div className='epidemiological-factors-title'>
						Trong thời gian vừa qua <span className='label-red'> (*)</span>:
					</div>

					<table className='epidemiological-factors-table'>
						<thead>
							<tr>
								<th>Yếu tố dịch tễ </th>
								<th>Có</th>
								<th>Không</th>
							</tr>
						</thead>
						<tbody>
							{epidemiologicalFactors.map(epidemiologicalFactor => (
								<tr key={epidemiologicalFactor.id}>
									<td>
										{epidemiologicalFactor.ten}
										<span className='label-red'> (*)</span>
									</td>
									<td>
										<input type='radio' name={epidemiologicalFactor.id} />
									</td>
									<td>
										<input type='radio' name={epidemiologicalFactor.id} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<TextArea
					placeholder='Vui lòng cung cấp thêm thông tin về triệu chứng hay dấu hiệu khác nếu có'
					className='more-info'
					rows={2}
				></TextArea>
				<div className='captcha'>
					<div className='captcha-title'>
						Vui lòng nhập mã xác thực <span className='label-red'> (*)</span>:
					</div>
					<div ref={codeRef} className='captcha-text'>
						{captchaText}
					</div>
					<Input
						type='number'
						className='captcha-code'
						onChange={e => setCaptchaText(e.target.value)}
					/>
				</div>

				<div className='submit-button-center'>
					<button type='submit'>Gửi</button>
				</div>
			</form>

			<Footer />
		</div>
	);
}
