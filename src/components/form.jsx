import React, {useState} from 'react';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Form, Input, Select} from 'antd';

const {Option} = Select;

export const ServiceForm = ({data, onSuccess}) => {
  const [form] = Form.useForm();
  const {cars, workNames, prices} = data
  const onFinish = (values) => {
    onSuccess(values)
    console.log('Received values of form:', values);
  };

  const handleChange = () => {
    form.setFieldsValue({works: []});
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{maxWidth: 600}}
      autoComplete="off"
    >
      <Form.Item name="car" label="Машина" rules={[{required: true, message: 'Обязательное поле'}]}>
        <Select options={cars} onChange={handleChange}/>
      </Form.Item>
      <Form.List name="works">
        {(fields, {add, remove}) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item
                  {...field}
                  label="Вид работы"
                  name={[field.name, 'work']}
                  rules={[{required: true, message: 'Обязательное поле'}]}

                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.car !== curValues.car || prevValues.works !== curValues.works
                  }
                >
                  <Select
                    showSearch
                    filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                    disabled={!form.getFieldValue('car')}
                    style={{width: `100%`}}
                    onChange={value => {
                      const re = prices.get(form.getFieldValue('works')[index].work)[form.getFieldValue('car')]
                      const data = form.getFieldValue('works');
                      data[index] = {...data[index], price: re};
                      form.setFieldValue('works', data);
                    }
                    }>
                    {workNames.map((item) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...field}
                  shouldUpdate
                  label="Цена"
                  name={[field.name, 'price']}
                  rules={[{required: true, message: 'Обязательное поле'}]}
                >
                  <Input readOnly/>
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)}/>
                <hr/>
              </div>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                Добавить
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Рассчитать
        </Button>
      </Form.Item>
    </Form>
  );
};


const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}