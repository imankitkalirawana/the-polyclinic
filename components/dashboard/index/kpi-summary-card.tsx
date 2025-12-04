import { Icon } from '@iconify/react/dist/iconify.js';
import { dummyData } from './data';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react';

export default function KPISummaryCards() {
  return dummyData.dashboardData.kpiSummary.map((item, index) => (
    <Card key={index}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon={item.icon} width={16} />
          <h6 className="text-sm font-medium">{item.metricName}</h6>
        </div>
        <Button isIconOnly variant="light" size="sm">
          <Icon icon="solar:menu-dots-bold" width={16} />
        </Button>
      </CardHeader>
      <CardBody className="flex-row items-center justify-between pb-2">
        <p className="text-2xl font-medium">{item.value}</p>
        <Chip
          color={item.trend === 'up' ? 'success' : 'danger'}
          size="sm"
          variant="flat"
          startContent={
            <Icon icon={item.trend === 'up' ? 'uil:arrow-growth' : 'uil:chart-down'} width={16} />
          }
        >
          <span>
            {item.changeValue}
            {item.changeUnit}
          </span>
        </Chip>
      </CardBody>
      <CardFooter className="pt-0">
        <p className="text-default-500 text-tiny">{item.changeDescription}</p>
      </CardFooter>
    </Card>
  ));
}
