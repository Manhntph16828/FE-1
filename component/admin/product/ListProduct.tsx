import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Form, InputNumber, Modal, Select, TableProps } from "antd";
import { Button, Space, Table } from "antd";
import type { ColumnsType, FilterValue, SorterResult } from "antd/es/table/interface";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { deleteBlog, getBlog, getBlogs } from "../../../redux/blogSlice";
import { RootState } from "../../../redux/store";
// import { deleteUser, getUsers } from "../../../redux/userSlice";
import { formatDate, thousandFormat } from "../../../untils";
import { getBlogCates } from "../../../redux/blogCateSlice";
import { Tblog } from "../../../models/blogs";
import { deleteProduct, getProducts } from "../../../redux/prdSlice";
import { getprdCates } from "../../../redux/prdCateSlice";
import { Option } from "antd/lib/mentions";
import { getprdSizes } from "../../../redux/prdSizeSlice";
import { getprdColors } from "../../../redux/prdColorSlice";
import { ProductColor, Tprd } from "../../../models/prd";

type Props = {};
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const BlogList = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setID] = useState("");
  const products = useSelector((state: RootState) => state.prd.products);
  const prdCate = useSelector((state: RootState) => state.prdCate.prdCates);
  const { prdSizes } = useSelector((state: any) => state.prdSize);
  const { prdColors } = useSelector((state: any) => state.prdColor);

  const dispatch = useDispatch<any>();
  const showModal = (id: string) => {
    setIsModalOpen(true);
    setID(id);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getprdCates());
    dispatch(getprdColors());
    dispatch(getprdSizes());
  }, [dispatch]);

  const productsFilter = prdCate?.map((item: any) => {
    return {
      text: item.name,
      value: item.name,
    };
  });
  const handleRemove = (id: any) => {
    Swal.fire({
      title: "B???n c?? ch???c ch???n mu???n x??a kh??ng?",
      text: "Kh??ng th??? ho??n t??c sau khi x??a",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "V??ng ch???c ch???n r???i!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteProduct(id)).unwrap();
        Swal.fire("Th??nh c??ng!", "X??a th??nh c??ng.", "success");
      }
    });
  };
  const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const columns: ColumnsType<Tblog> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "T??n s???n ph???m",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Gi??",
      dataIndex: "price",
      key: "price",
      render: (price) => thousandFormat(price) + ' VND'
    },
    {
      title: "Danh m???c",
      dataIndex: "categoryId",
      key: "categoryId",
      filters: productsFilter,
      onFilter: (value: any, record: any): any => record.categoryId?.includes(value),
    },
    {
      title: "???nh",
      dataIndex: "image",
      key: "image",
      render: (img) => <img src={img} width="120" alt="" />,
    },
    {
      title: "T???ng s??? l?????ng",
      key: "colors",
      render: (data: any) => {
        console.log('data', data);
        return data.action.colors.map((i: ProductColor) => i.sizes.reduce((a, b) => a + b.amount, 0)).reduce((a: number, b: number) => a + b, 0) || 0
      },
    },

    {
      title: "H??nh ?????ng",
      key: "action",
      render: (item) => (
        <>
          <Link href={`/admin/product/${item.action._id}/edit`}>
            <a className="h-8 inline-flex items-center px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              S???a
            </a>
          </Link>
          <button
            onClick={() => handleRemove(item.action._id)}
            className="h-8 inline-flex items-center px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-3"
          >
            Xo??
          </button>
        </>
      ),
    },
  ];

  const data: any = products?.map((item, index) => {
    return {
      stt: index,
      title: item.name,
      price: item.price,
      categoryId: item.categoryId?.name,
      image: item.image,
      desc: item.desc,
      action: item,
      id: item._id,
    };
  });
  console.log(data);

  // const AddQuantity = () => {
  //   const [form] = Form.useForm();
  //   const dataNews = prdAmounts?.filter((item: any) => item?.prd_id?._id === id);
  //
  //   if (!prdAmounts) return <div>Loading...</div>;
  //   const onReset = () => {
  //     form.resetFields();
  //   };
  //   const onFinish = (values: any) => {
  //     values.prd_id = id;
  //
  //     let flag = false;
  //     dataNews.map((item: any) => {
  //       if (values.prd_id == item.prd_id._id && values.size_id == item.size_id._id && values.color == item.color._id) {
  //         flag = true;
  //         Swal.fire({
  //           title: "S???n ph???m ???? t???n t???i b???n c?? mu???n th??m n???a kh??ng?",
  //           text: "You won't be able to revert this!",
  //           icon: "warning",
  //           showCancelButton: true,
  //           confirmButtonColor: "#3085d6",
  //           cancelButtonColor: "#d33",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             Swal.fire({
  //               icon: "success",
  //               title: "S???a th??nh c??ng",
  //               showConfirmButton: false,
  //               timer: 1500,
  //             });
  //             const data = {
  //               _id: item._id,
  //               amount: values.amount + item.amount,
  //             };
  //             console.log(item);
  //
  //
  //             onReset();
  //           }
  //         });
  //
  //         return;
  //       }
  //     });
  //     if (flag === false) {
  //       dispatch(addprdAmount({ ...values }))
  //         .unwrap()
  //         .then(() => {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Th??m th??nh c??ng",
  //             timer: 1000,
  //             showConfirmButton: false,
  //           });
  //           onReset();
  //         })
  //         .catch((err: any) => alert(err));
  //     }
  //   };
  //   const onFinishFailed = (errorInfo: any) => {
  //     console.log("Failed:", errorInfo);
  //   };
  //
  //   const columns: any = [
  //     {
  //       title: "Name",
  //       dataIndex: "name",
  //       key: "name",
  //     },
  //     {
  //       title: "size",
  //       dataIndex: "size",
  //       key: "size",
  //     },
  //     {
  //       title: "Color",
  //       dataIndex: "Color",
  //       key: "Color",
  //     },
  //     {
  //       title: "s??? l?????ng",
  //       dataIndex: "quantity",
  //       key: "quantity",
  //     },
  //   ];
  //
  //   if (!dataNews) return <div></div>;
  //   const data = dataNews?.map((item: any) => {
  //     return {
  //       name: item?.prd_id?.name,
  //       size: item?.size_id?.name,
  //       Color: item?.color?.name,
  //       quantity: item?.amount,
  //     };
  //   });
  //
  //   return (
  //     <>
  //       <Modal title="chi ti???t" width={1000} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
  //         <Form
  //           name="basic"
  //           labelCol={{ span: 8 }}
  //           wrapperCol={{ span: 16 }}
  //           initialValues={{ remember: true }}
  //           onFinish={onFinish}
  //           onFinishFailed={onFinishFailed}
  //           autoComplete="off"
  //           form={form}
  //         >
  //           <Form.Item name="size_id" label="Size" rules={[{ required: true }]}>
  //             <Select placeholder="vui l??ng nh???p size" allowClear>
  //               {prdSizes?.map((item: any) => (
  //                 <Option value={item._id}>{item.name}</Option>
  //               ))}
  //             </Select>
  //           </Form.Item>
  //           <Form.Item name="color" label="color" rules={[{ required: true }]}>
  //             <Select placeholder="vui l??ng nh???p m??u s???c" allowClear>
  //               {prdColors?.map((item: any) => (
  //                 <Option value={item._id}>{item.name}</Option>
  //               ))}
  //             </Select>
  //           </Form.Item>
  //           <Form.Item name="amount" label="s??? l?????ng" rules={[{ required: true }]}>
  //             <InputNumber min={1} />
  //           </Form.Item>
  //           <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
  //             <Button type="primary" htmlType="submit">
  //               Submit
  //             </Button>
  //           </Form.Item>
  //         </Form>
  //
  //         <Table columns={columns} dataSource={data} />
  //       </Modal>
  //     </>
  //   );
  // };
  return (
    <>
      <Table columns={columns} dataSource={data} />
      {/*<AddQuantity />*/}
    </>
  );
};

export default BlogList;
