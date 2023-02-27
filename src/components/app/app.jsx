import {ServiceForm} from "../form";
import 'antd/dist/reset.css';
import {useEffect, useState} from "react";
import getJSONFromFile from "../../utility/getJsonFromFile";
import {Col, List, Modal, Row, Spin} from "antd";
import './styles.css';

export default function App() {
  const [modal, contextHolder] = Modal.useModal();
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({areas: [], prices: [], worksNames: []})
  useEffect(() => {
    setIsLoading(true)
    fetch('table.xlsx')
      .then(data => data.blob())
      .then(res => getJSONFromFile(res))
      .then(res => {
        setData(res)
        setIsLoading(false)
      })
  }, [])

  const handleResult = (values) => {
    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];
    modal.info(({
      title: 'Итого',
      content:
        <List
          size="small"
          footer={<div>Всего: {values.works.reduce((acc, item) => acc + item.price, 0)} рублей</div>}
          bordered
          dataSource={values.works}
          renderItem={(item) =>
            <List.Item>
              <List.Item.Meta
                title={item.work}
                description={item.price}
              />
            </List.Item>}
        />
    }))
  }
  if (isLoading) {
    return <div className="spinner">
      <Spin size="large"/>
    </div>
  }
  const content = data && <ServiceForm data={data} onSuccess={handleResult}/>
  return (<Row>
      <Col style={{marginTop: '50px', width: '100%', padding: '20px', maxWidth: '480px', marginInline: "auto"}}>
        {content}
        {contextHolder}
      </Col>
    </Row>
  )
}